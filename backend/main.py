import os
import shutil
from fastapi import FastAPI, Depends, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles 
from sqlalchemy.orm import Session
from database import engine, Base, OturumLocal, Gorev

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

@app.get("/gorevler")
def gorevleri_getir(db: Session = Depends(veritabani_getir)):
    gorevler = db.query(Gorev).all()
    return gorevler


@app.post("/gorev_ekle")
async def gorev_ekle(
    baslik: str = Form(...),
    aciklama: str = Form(...),
    tarih: str = Form(...),
    gunNo: int = Form(...),
    ayNo: int = Form(...),
    yilNo: int = Form(...),
    dosya: UploadFile = File(None),
    db: Session = Depends(veritabani_getir)
):
    dosya_adresi = None
    dosya_tipi = None

    if dosya:
        if dosya.filename.endswith(".pdf"):
            dosya_tipi = "pdf"
        else:
            dosya_tipi = "resim"

        dosya_yolu = f"{DOSYA_KLASORU}/{dosya.filename}"
        with open(dosya_yolu, "wb") as buffer:
            shutil.copyfileobj(dosya.file, buffer)
        
        dosya_adresi = dosya.filename 

    yeni_gorev = Gorev(
        baslik=baslik,
        aciklama=aciklama,
        tarih=tarih,
        gunNo=gunNo,
        ayNo=ayNo,
        yilNo=yilNo,
        dosya_adresi=dosya_adresi,
        dosya_tipi=dosya_tipi,
        durum=False
    )

    db.add(yeni_gorev)
    db.commit()
    db.refresh(yeni_gorev)

    return {"mesaj": "Görev eklendi!", "gorev_id": yeni_gorev.id, "dosya_adresi": dosya_adresi, "dosya_tipi": dosya_tipi}


@app.put("/gorev_guncelle/{id}")
def gorevi_guncelle(
    id: int, 
    baslik: str = Form(...), 
    aciklama: str = Form(...), 
    durum: str = Form(...), 
    dosya_sil: str = Form("false"), # YENİ: Ön yüzden "dosya silinsin mi?" bilgisi gelir
    dosya: UploadFile = File(None), 
    db: Session = Depends(veritabani_getir)
):
    guncellenecek = db.query(Gorev).filter(Gorev.id == id).first()
    if guncellenecek:
        guncellenecek.baslik = baslik
        guncellenecek.aciklama = aciklama
        guncellenecek.durum = True if durum.lower() == 'true' else False
        
        # YENİ: Eğer kullanıcı "Dosyayı Sil" çöp kutusuna bastıysa, fiziksel olarak klasörden siliyoruz
        if dosya_sil.lower() == 'true':
            if guncellenecek.dosya_adresi:
                eski_dosya = f"{DOSYA_KLASORU}/{guncellenecek.dosya_adresi}"
                if os.path.exists(eski_dosya):
                    os.remove(eski_dosya) # Klasörden uçurur
            guncellenecek.dosya_adresi = None
            guncellenecek.dosya_tipi = None

        # Eğer yeni dosya yüklenirse eskisini ez
        if dosya:
            if dosya.filename.endswith(".pdf"):
                guncellenecek.dosya_tipi = "pdf"
            else:
                guncellenecek.dosya_tipi = "resim"
                
            dosya_yolu = f"{DOSYA_KLASORU}/{dosya.filename}"
            with open(dosya_yolu, "wb") as buffer:
                shutil.copyfileobj(dosya.file, buffer)
            
            guncellenecek.dosya_adresi = dosya.filename

        db.commit() 
        return {
            "mesaj": "Görev başarıyla güncellendi", 
            "dosya_adresi": guncellenecek.dosya_adresi, 
            "dosya_tipi": guncellenecek.dosya_tipi
        }
    return {"hata": "Görev bulunamadı"}


@app.delete("/gorev_sil/{id}")
def gorevi_sil(id: int, db: Session = Depends(veritabani_getir)):
    silinecek = db.query(Gorev).filter(Gorev.id == id).first()
    if silinecek:
        # YENİ: Görev tamamen siliniyorsa, ona bağlı pdf/resmi de bilgisayardan sil ki klasör dolmasın
        if silinecek.dosya_adresi:
            eski_dosya = f"{DOSYA_KLASORU}/{silinecek.dosya_adresi}"
            if os.path.exists(eski_dosya):
                os.remove(eski_dosya)

        db.delete(silinecek) 
        db.commit() 
        return {"mesaj": "Görev kalıcı olarak silindi"}
    return {"hata": "Görev bulunamadı"}