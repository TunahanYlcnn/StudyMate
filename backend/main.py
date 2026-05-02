import os
import shutil
from typing import List, Optional
from fastapi import FastAPI, Depends, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles 
from sqlalchemy.orm import Session
from database import engine, Base, OturumLocal, Gorev, Kullanici

Base.metadata.create_all(bind=engine)

app = FastAPI(title="StudyMate API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DOSYA_KLASORU = "yuklenen_dosyalar"
if not os.path.exists(DOSYA_KLASORU):
    os.makedirs(DOSYA_KLASORU)

app.mount("/dosyalar", StaticFiles(directory=DOSYA_KLASORU), name="dosyalar")

def veritabani_getir():
    db = OturumLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def ana_sayfa():
    return {"mesaj": "StudyMate API Tam Sürüm Çalışıyor 🚀"}

# ==========================================
# YENİ: KULLANICI KAYIT OLMA (REGISTER)
# ==========================================
@app.post("/kayit_ol")
def kayit_ol(
    kullanici_adi: str = Form(...),
    eposta: str = Form(...),
    sifre: str = Form(...),
    db: Session = Depends(veritabani_getir)
):
    # Bu kullanıcı adı veya e-posta daha önce alınmış mı kontrol et
    kullanici_var_mi = db.query(Kullanici).filter((Kullanici.kullanici_adi == kullanici_adi) | (Kullanici.eposta == eposta)).first()
    if kullanici_var_mi:
        raise HTTPException(status_code=400, detail="Bu kullanıcı adı veya e-posta zaten kullanımda!")
    
    yeni_kullanici = Kullanici(kullanici_adi=kullanici_adi, eposta=eposta, sifre=sifre)
    db.add(yeni_kullanici)
    db.commit()
    return {"mesaj": "Kayıt başarıyla oluşturuldu!"}

# ==========================================
# YENİ: KULLANICI GİRİŞ YAPMA (LOGIN)
# ==========================================
@app.post("/giris_yap")
def giris_yap(
    kullanici_adi: str = Form(...),
    sifre: str = Form(...),
    db: Session = Depends(veritabani_getir)
):
    kullanici = db.query(Kullanici).filter(Kullanici.kullanici_adi == kullanici_adi, Kullanici.sifre == sifre).first()
    if not kullanici:
        raise HTTPException(status_code=400, detail="Hatalı kullanıcı adı veya şifre!")
    
    # Giriş başarılıysa ön yüze kullanıcının ID'sini (kimliğini) yolla
    return {"mesaj": "Giriş başarılı", "kullanici_id": kullanici.id, "kullanici_adi": kullanici.kullanici_adi}

# ==========================================
# GÜNCELLENDİ: SADECE GİRİŞ YAPAN KULLANICININ GÖREVLERİNİ GETİRİR
# ==========================================
@app.get("/gorevler/{kullanici_id}")
def gorevleri_getir(kullanici_id: int, db: Session = Depends(veritabani_getir)):
    gorevler = db.query(Gorev).filter(Gorev.kullanici_id == kullanici_id).all()
    return gorevler


@app.post("/gorev_ekle")
async def gorev_ekle(
    kullanici_id: int = Form(...), # YENİ: Görevi kimin eklediğini alıyoruz
    baslik: str = Form(...),
    aciklama: str = Form(...),
    tarih: str = Form(...),
    gunNo: int = Form(...),
    ayNo: int = Form(...),
    yilNo: int = Form(...),
    dosyalar: list[UploadFile] = File(None), 
    db: Session = Depends(veritabani_getir)
):
    kaydedilenler = []

    if dosyalar:
        for dosya in dosyalar:
            if dosya.filename: 
                dosya_yolu = f"{DOSYA_KLASORU}/{dosya.filename}"
                with open(dosya_yolu, "wb") as buffer:
                    shutil.copyfileobj(dosya.file, buffer)
                kaydedilenler.append(dosya.filename)
    
    dosya_adresi = "|".join(kaydedilenler) if kaydedilenler else None

    yeni_gorev = Gorev(
        kullanici_id=kullanici_id, # YENİ: Görevi kullanıcıya bağladık
        baslik=baslik,
        aciklama=aciklama,
        tarih=tarih,
        gunNo=gunNo,
        ayNo=ayNo,
        yilNo=yilNo,
        dosya_adresi=dosya_adresi,
        dosya_tipi=None, 
        durum=False
    )

    db.add(yeni_gorev)
    db.commit()
    db.refresh(yeni_gorev)

    return {"mesaj": "Görev eklendi!", "gorev_id": yeni_gorev.id, "dosya_adresi": dosya_adresi}


@app.put("/gorev_guncelle/{id}")
def gorevi_guncelle(
    id: int, 
    baslik: str = Form(...), 
    aciklama: str = Form(...), 
    durum: str = Form(...), 
    kalan_dosyalar: str = Form(""), 
    dosyalar: list[UploadFile] = File(None), 
    db: Session = Depends(veritabani_getir)
):
    guncellenecek = db.query(Gorev).filter(Gorev.id == id).first()
    if guncellenecek:
        guncellenecek.baslik = baslik
        guncellenecek.aciklama = aciklama
        guncellenecek.durum = True if durum.lower() == 'true' else False
        
        eski_dosya_listesi = guncellenecek.dosya_adresi.split("|") if guncellenecek.dosya_adresi else []
        kalan_liste = kalan_dosyalar.split("|") if kalan_dosyalar else []
        
        for eski in eski_dosya_listesi:
            if eski not in kalan_liste:
                silinecek_yol = f"{DOSYA_KLASORU}/{eski}"
                if os.path.exists(silinecek_yol):
                    os.remove(silinecek_yol)
        
        yeni_eklenenler = []
        if dosyalar:
            for dosya in dosyalar:
                if dosya.filename:
                    yol = f"{DOSYA_KLASORU}/{dosya.filename}"
                    with open(yol, "wb") as buffer:
                        shutil.copyfileobj(dosya.file, buffer)
                    yeni_eklenenler.append(dosya.filename)
        
        tum_dosyalar = kalan_liste + yeni_eklenenler
        guncellenecek.dosya_adresi = "|".join(tum_dosyalar) if tum_dosyalar else None

        db.commit() 
        return {
            "mesaj": "Görev güncellendi", 
            "dosya_adresi": guncellenecek.dosya_adresi
        }
    return {"hata": "Görev bulunamadı"}


@app.delete("/gorev_sil/{id}")
def gorevi_sil(id: int, db: Session = Depends(veritabani_getir)):
    silinecek = db.query(Gorev).filter(Gorev.id == id).first()
    if silinecek:
        if silinecek.dosya_adresi:
            dosya_isimleri = silinecek.dosya_adresi.split("|")
            for d_isim in dosya_isimleri:
                eski_dosya = f"{DOSYA_KLASORU}/{d_isim}"
                if os.path.exists(eski_dosya):
                    os.remove(eski_dosya)

        db.delete(silinecek) 
        db.commit() 
        return {"mesaj": "Görev kalıcı olarak silindi"}
    return {"hata": "Görev bulunamadı"}