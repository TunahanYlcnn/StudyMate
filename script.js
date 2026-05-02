// Görevlerimizi saklayacağımız boş liste (Veri Yapısı)
let gorevler = [];

// Sisteme giriş yapan kullanıcının kimliğini hafızada tutuyoruz
let aktifKullaniciId = null;

let gosterilenAy = new Date().getMonth(); 
let gosterilenYil = new Date().getFullYear();
let duzenlenenGorevId = null;

let yeniSecilenDosyalar = []; 
let mevcutKalanDosyalar = []; 

function baloncukKonumGuncelle() { return; }
window.addEventListener('resize', baloncukKonumGuncelle);

document.getElementById('baloncukDosya').addEventListener('change', function(e) {
    const files = Array.from(e.target.files);
    yeniSecilenDosyalar = yeniSecilenDosyalar.concat(files);
    dosyalariListeyeCiz();
});

function dosyalariListeyeCiz() {
    const liste = document.getElementById('secilenDosyalarListesi');
    liste.innerHTML = '';
    
    mevcutKalanDosyalar.forEach((dosyaIsmi, index) => {
        const badge = document.createElement('div');
        badge.className = 'dosya-badge';
        badge.innerHTML = `<span>💾 ${dosyaIsmi.substring(0,15)}...</span> <span class="dosya-badge-sil" onclick="mevcutDosyayiKaldir(${index})" title="Dosyayı Sil">✖</span>`;
        liste.appendChild(badge);
    });
    
    yeniSecilenDosyalar.forEach((dosyaObj, index) => {
        const badge = document.createElement('div');
        badge.className = 'dosya-badge';
        badge.style.background = '#e8f5e9'; 
        badge.style.color = '#2E7D32';
        badge.style.borderColor = '#c5e1a5';
        badge.innerHTML = `<span>➕ ${dosyaObj.name.substring(0,15)}...</span> <span class="dosya-badge-sil" onclick="yeniDosyayiKaldir(${index})" title="Seçimi İptal Et">✖</span>`;
        liste.appendChild(badge);
    });
}

function mevcutDosyayiKaldir(index) {
    mevcutKalanDosyalar.splice(index, 1);
    dosyalariListeyeCiz();
}

function yeniDosyayiKaldir(index) {
    yeniSecilenDosyalar.splice(index, 1);
    document.getElementById('baloncukDosya').value = ""; 
    dosyalariListeyeCiz();
}

window.onload = async function() {
    zamanGuncelle();
    setInterval(zamanGuncelle, 1000); 
    takvimOlustur();
    
    // Sayfa yenilense bile tarayıcının kalıcı hafızasında kimliğimiz duruyor mu diye bakıyoruz
    const kayitliKullaniciId = localStorage.getItem('studyMateKullaniciId');
    const kayitliKullaniciAdi = localStorage.getItem('studyMateKullaniciAdi');

    if (kayitliKullaniciId && kayitliKullaniciAdi) {
        // Eğer hafızada kayıtlıysak giriş ekranını atla, direkt sistemi aç!
        aktifKullaniciId = kayitliKullaniciId;
        document.getElementById('kullaniciKarsilama').textContent = "- Hoş geldin, " + kayitliKullaniciAdi;
        
        document.getElementById('anaMenu').classList.remove('gizli');
        sayfaGoster('planlamaSayfasi'); 
        
        // Sadece bize ait olan görevleri veritabanından çek
        try {
            const gorevCevap = await fetch("http://127.0.0.1:8000/gorevler/" + aktifKullaniciId);
            if (gorevCevap.ok) {
                gorevler = await gorevCevap.json();
                gorevleriEkranaYazdir();
            }
        } catch(hata) {
            console.log("Sunucuya bağlanılamadı, görevler getirilemedi.");
        }
    }
};

function zamanGuncelle() {
    const simdi = new Date();
    const seceneklerTarih = { day: 'numeric', month: 'long', year: 'numeric' };
    document.getElementById('tarihYazisi').textContent = "Bugün: " + simdi.toLocaleDateString('tr-TR', seceneklerTarih);
    const saat = simdi.getHours().toString().padStart(2, '0');
    const dakika = simdi.getMinutes().toString().padStart(2, '0');
    document.getElementById('saatYazisi').textContent = saat + ":" + dakika;
}

function authEkranDegistir(hedefId) {
    const ekranlar = ['authGiris', 'authKayit', 'authSifremiUnuttum'];
    ekranlar.forEach(id => {
        document.getElementById(id).classList.add('gizli');
    });
    document.getElementById(hedefId).classList.remove('gizli');
}

document.getElementById('kayitFormu').addEventListener('submit', async function(olay) {
    olay.preventDefault(); 
    const kullaniciAdi = document.getElementById('kayitKullaniciAdi').value;
    const eposta = document.getElementById('kayitEposta').value;
    const sifre = document.getElementById('kayitSifre').value;

    const paket = new FormData();
    paket.append("kullanici_adi", kullaniciAdi);
    paket.append("eposta", eposta);
    paket.append("sifre", sifre);

    try {
        const cevap = await fetch("http://127.0.0.1:8000/kayit_ol", { method: "POST", body: paket });
        const veri = await cevap.json();
        
        if (cevap.ok) {
            alert("Tebrikler! Kayıt başarılı. Lütfen giriş yapın.");
            authEkranDegistir('authGiris'); 
        } else {
            alert("Hata: " + veri.detail);
        }
    } catch(hata) { alert("Sunucuya bağlanılamadı!"); }
});

document.getElementById('girisFormu').addEventListener('submit', async function(olay) {
    olay.preventDefault(); 
    const kullaniciAdi = document.getElementById('girisKullaniciAdi').value;
    const sifre = document.getElementById('girisSifre').value;

    const paket = new FormData();
    paket.append("kullanici_adi", kullaniciAdi);
    paket.append("sifre", sifre);

    try {
        const cevap = await fetch("http://127.0.0.1:8000/giris_yap", { method: "POST", body: paket });
        const veri = await cevap.json();
        
        if (cevap.ok) {
            aktifKullaniciId = veri.kullanici_id; 
            
            localStorage.setItem('studyMateKullaniciId', veri.kullanici_id);
            localStorage.setItem('studyMateKullaniciAdi', veri.kullanici_adi);

            document.getElementById('kullaniciKarsilama').textContent = "- Hoş geldin, " + veri.kullanici_adi;
            document.getElementById('anaMenu').classList.remove('gizli');
            sayfaGoster('planlamaSayfasi'); 
            
            const gorevCevap = await fetch("http://127.0.0.1:8000/gorevler/" + aktifKullaniciId);
            if (gorevCevap.ok) {
                gorevler = await gorevCevap.json();
                gorevleriEkranaYazdir();
            }
        } else {
            alert("Hata: " + veri.detail);
        }
    } catch(hata) { alert("Sunucuya bağlanılamadı!"); }
});

document.getElementById('sifreSifirlaFormu').addEventListener('submit', function(olay) {
    olay.preventDefault();
    alert("Şifre sıfırlama linki e-postanıza gönderildi! (Bu bir test sürümüdür)");
    authEkranDegistir('authGiris');
});


function sayfaGoster(hedefSayfaId) {
    const sayfalar = ['girisSayfasi', 'planlamaSayfasi'];
    sayfalar.forEach(function(sayfaId) {
        document.getElementById(sayfaId).classList.add('gizli');
    });
    document.getElementById(hedefSayfaId).classList.remove('gizli');
    baloncuguKapat(); 
}

function cikisYap() {
    localStorage.removeItem('studyMateKullaniciId');
    localStorage.removeItem('studyMateKullaniciAdi');

    aktifKullaniciId = null; 
    gorevler = []; 
    gorevleriEkranaYazdir(); 
    
    document.getElementById('anaMenu').classList.add('gizli');
    sayfaGoster('girisSayfasi');
    authEkranDegistir('authGiris'); 
}

let seciliTarihBilgisi = ""; 
let seciliGunNumarasi = 0;   
let seciliAyBilgisi = 0;
let seciliYilBilgisi = 0;

function takvimiAcKapat() {
    const icerik = document.getElementById('takvimIcerik');
    const ok = document.getElementById('takvimOku');
    icerik.classList.toggle('gizli-takvim');
    ok.classList.toggle('ok-donmus');
}

function ayDegistir(yon) {
    gosterilenAy += yon; 
    if (gosterilenAy > 11) {
        gosterilenAy = 0;
        gosterilenYil++;
    } else if (gosterilenAy < 0) {
        gosterilenAy = 11;
        gosterilenYil--;
    }
    takvimOlustur();
    baloncuguKapat(); 
}

function takvimOlustur() {
    const izgara = document.getElementById('takvimIzgarasi');
    izgara.innerHTML = '';
    
    const simdi = new Date();
    const gercekBugununGunu = simdi.getDate();
    const gercekBugununAyi = simdi.getMonth();
    const gercekBugununYili = simdi.getFullYear();
    
    const aydakiGunSayisi = new Date(gosterilenYil, gosterilenAy + 1, 0).getDate();
    let ilkGun = new Date(gosterilenYil, gosterilenAy, 1).getDay();
    ilkGun = ilkGun === 0 ? 6 : ilkGun - 1;

    let oncekiAy = gosterilenAy - 1;
    let oncekiYil = gosterilenYil;
    if (oncekiAy < 0) { oncekiAy = 11; oncekiYil--; }
    
    let sonrakiAy = gosterilenAy + 1;
    let sonrakiYil = gosterilenYil;
    if (sonrakiAy > 11) { sonrakiAy = 0; sonrakiYil++; }

    const oncekiAyGunSayisi = new Date(gosterilenYil, gosterilenAy, 0).getDate();
    const ayIsimleri = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
    document.getElementById('gosterilenAyYazisi').textContent = ayIsimleri[gosterilenAy] + " " + gosterilenYil;
    
    for (let i = ilkGun - 1; i >= 0; i--) {
        let pGun = oncekiAyGunSayisi - i;
        const gunKutusu = document.createElement('div');
        gunKutusu.className = 'takvim-gunu pasif-gun';
        gunKutusu.id = 'takvim-kutu-' + oncekiYil + '-' + oncekiAy + '-' + pGun;
        gunKutusu.textContent = pGun;
        if (pGun === gercekBugununGunu && oncekiAy === gercekBugununAyi && oncekiYil === gercekBugununYili) {
            gunKutusu.classList.add('bugun-cercevesi');
        }
        gunKutusu.onclick = function(olay) { baloncukAc(olay, pGun, oncekiAy, oncekiYil); };
        izgara.appendChild(gunKutusu);
    }

    for(let gun = 1; gun <= aydakiGunSayisi; gun++) {
        const gunKutusu = document.createElement('div');
        gunKutusu.className = 'takvim-gunu';
        gunKutusu.id = 'takvim-kutu-' + gosterilenYil + '-' + gosterilenAy + '-' + gun; 
        gunKutusu.textContent = gun;
        if (gun === gercekBugununGunu && gosterilenAy === gercekBugununAyi && gosterilenYil === gercekBugununYili) {
            gunKutusu.classList.add('bugun-cercevesi');
        }
        gunKutusu.onclick = function(olay) { baloncukAc(olay, gun, gosterilenAy, gosterilenYil); };
        izgara.appendChild(gunKutusu);
    }

    const toplamHucre = ilkGun + aydakiGunSayisi;
    const kalanHucre = (7 - (toplamHucre % 7)) % 7; 
    for (let i = 1; i <= kalanHucre; i++) {
        const gunKutusu = document.createElement('div');
        gunKutusu.className = 'takvim-gunu pasif-gun';
        gunKutusu.id = 'takvim-kutu-' + sonrakiYil + '-' + sonrakiAy + '-' + i;
        gunKutusu.textContent = i;
        if (i === gercekBugununGunu && sonrakiAy === gercekBugununAyi && sonrakiYil === gercekBugununYili) {
            gunKutusu.classList.add('bugun-cercevesi');
        }
        gunKutusu.onclick = function(olay) { baloncukAc(olay, i, sonrakiAy, sonrakiYil); };
        izgara.appendChild(gunKutusu);
    }
    takvimiRenklendir(); 
}

document.addEventListener('click', function(olay) {
    const baloncuk = document.getElementById('gorevBaloncugu');
    
    if (!baloncuk.classList.contains('gizli-tamamen')) {
        if (olay.target.id === 'gorevBaloncugu') {
            const formAlani = document.getElementById('baloncukFormAlani');
            
            if (!formAlani.classList.contains('gizli')) {
                const konu = document.getElementById('baloncukKonu').value;
                const icerik = document.getElementById('baloncukIcerik').value;
                if (konu.trim() !== "" && icerik.trim() !== "") {
                    baloncuktanKaydet();
                } else {
                    baloncuguKapat();
                }
            } else {
                baloncuguKapat();
            }
        }
    }
});

function baloncukIceriginiGuncelleVeyaKapat() {
    const baloncuk = document.getElementById('gorevBaloncugu');
    if (baloncuk.classList.contains('gizli-tamamen')) return;

    const oGunkuGorevler = gorevler.filter(g => g.gunNo === seciliGunNumarasi && g.ayNo === seciliAyBilgisi && g.yilNo === seciliYilBilgisi);
    const listeAlani = document.getElementById('baloncukMevcutGorevler');
    const formAlani = document.getElementById('baloncukFormAlani');
    const yeniGorevBtn = document.getElementById('baloncukYeniGorevBtn');

    if (!yeniGorevBtn.classList.contains('gizli')) {
        listeAlani.innerHTML = '';
        
        if (oGunkuGorevler.length > 0) {
            oGunkuGorevler.forEach(gorev => {
                const satir = document.createElement('div');
                satir.className = 'baloncuk-gorev-satiri';
                
                const durumIkonu = gorev.durum ? '✅' : '❌';
                const yaziEfecti = gorev.durum ? 'ustu-cizili' : '';
                const dosyaSayisi = gorev.dosya_adresi ? gorev.dosya_adresi.split('|').length : 0;
                const dosyaEkiHTML = dosyaSayisi > 0 ? `<span class="dosya-etiketi-kucuk">📎 ${dosyaSayisi} Ek Dosya</span>` : '';
                
                satir.innerHTML = `
                    <div style="display:flex; flex-direction:column;">
                        <span class="${yaziEfecti}">${gorev.baslik}</span>
                        ${dosyaEkiHTML}
                    </div>
                    <div class="ikon-grubu">
                        <span onclick="gorevDurumuDegistir(${gorev.id})" title="Durumu Değiştir">${durumIkonu}</span>
                        <span onclick="goreviDuzenle(${gorev.id})" title="Düzenle">✏️</span>
                        <span onclick="goreviSil(${gorev.id})" title="Sil">🗑️</span>
                    </div>
                `;
                listeAlani.appendChild(satir);
            });
        } else {
            baloncuguKapat();
        }
    }
}

function baloncukAc(olay, gun, ay, yil) {
    const baloncuk = document.getElementById('gorevBaloncugu');
    
    seciliGunNumarasi = gun; 
    seciliAyBilgisi = ay; 
    seciliYilBilgisi = yil; 
    const ayIsimleri = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
    seciliTarihBilgisi = gun + " " + ayIsimleri[ay] + " " + yil; 
    
    document.getElementById('modalBaslikYazisi').textContent = seciliTarihBilgisi + " Planları";

    baloncuk.classList.remove('gizli-tamamen');
    document.body.style.overflow = 'hidden'; 

    const oGunkuGorevler = gorevler.filter(g => g.gunNo === gun && g.ayNo === ay && g.yilNo === yil);
    
    const listeAlani = document.getElementById('baloncukMevcutGorevler');
    const yeniGorevBtn = document.getElementById('baloncukYeniGorevBtn');
    const formAlani = document.getElementById('baloncukFormAlani');

    listeAlani.innerHTML = ''; 
    duzenlenenGorevId = null; 
    
    document.getElementById('baloncukKonu').value = "";
    document.getElementById('baloncukIcerik').value = "";
    document.getElementById('baloncukDosya').value = ""; 
    
    yeniSecilenDosyalar = [];
    mevcutKalanDosyalar = [];
    dosyalariListeyeCiz();

    if (oGunkuGorevler.length > 0) {
        formAlani.classList.add('gizli');
        yeniGorevBtn.classList.remove('gizli');
        baloncukIceriginiGuncelleVeyaKapat();
    } else {
        formAlani.classList.remove('gizli');
        yeniGorevBtn.classList.add('gizli');
    }
}

function yeniGorevFormunuAc() {
    document.getElementById('baloncukKonu').value = "";
    document.getElementById('baloncukIcerik').value = "";
    document.getElementById('baloncukDosya').value = ""; 
    
    yeniSecilenDosyalar = [];
    mevcutKalanDosyalar = [];
    dosyalariListeyeCiz();

    duzenlenenGorevId = null; 
    document.getElementById('baloncukFormAlani').classList.remove('gizli');
    document.getElementById('baloncukYeniGorevBtn').classList.add('gizli');
}

function goreviDuzenle(id) {
    const gorev = gorevler.find(g => g.id === id);
    if (gorev) {
        document.getElementById('baloncukKonu').value = gorev.baslik;
        document.getElementById('baloncukIcerik').value = gorev.aciklama;
        document.getElementById('baloncukDosya').value = "";
        
        yeniSecilenDosyalar = [];
        mevcutKalanDosyalar = gorev.dosya_adresi ? gorev.dosya_adresi.split('|') : [];
        dosyalariListeyeCiz();
        
        duzenlenenGorevId = id; 
        document.getElementById('baloncukFormAlani').classList.remove('gizli');
        document.getElementById('baloncukYeniGorevBtn').classList.add('gizli');
    }
}

function listedenGoreviDuzenle(id) {
    const gorev = gorevler.find(g => g.id === id);
    if (!gorev) return;

    if (gosterilenAy !== gorev.ayNo || gosterilenYil !== gorev.yilNo) {
        gosterilenAy = gorev.ayNo;
        gosterilenYil = gorev.yilNo;
        takvimOlustur();
    }

    const kutuId = 'takvim-kutu-' + gorev.yilNo + '-' + gorev.ayNo + '-' + gorev.gunNo;
    const kutu = document.getElementById(kutuId);

    if (kutu) {
        kutu.scrollIntoView({behavior: 'smooth', block: 'center'});

        seciliGunNumarasi = gorev.gunNo; 
        seciliAyBilgisi = gorev.ayNo; 
        seciliYilBilgisi = gorev.yilNo; 
        const ayIsimleri = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
        seciliTarihBilgisi = gorev.gunNo + " " + ayIsimleri[gorev.ayNo] + " " + gorev.yilNo; 
        
        document.getElementById('modalBaslikYazisi').textContent = seciliTarihBilgisi + " Planları";

        const baloncuk = document.getElementById('gorevBaloncugu');
        baloncuk.classList.remove('gizli-tamamen');
        document.body.style.overflow = 'hidden';

        document.getElementById('baloncukKonu').value = gorev.baslik;
        document.getElementById('baloncukIcerik').value = gorev.aciklama;
        document.getElementById('baloncukDosya').value = ""; 
        
        yeniSecilenDosyalar = [];
        mevcutKalanDosyalar = gorev.dosya_adresi ? gorev.dosya_adresi.split('|') : [];
        dosyalariListeyeCiz();
        
        duzenlenenGorevId = id; 
        document.getElementById('baloncukMevcutGorevler').innerHTML = ''; 
        document.getElementById('baloncukFormAlani').classList.remove('gizli'); 
        document.getElementById('baloncukYeniGorevBtn').classList.add('gizli');
    }
}

function baloncuguKapat() {
    document.getElementById('gorevBaloncugu').classList.add('gizli-tamamen');
    document.body.style.overflow = ''; 

    document.getElementById('baloncukKonu').value = "";
    document.getElementById('baloncukIcerik').value = "";
    document.getElementById('baloncukDosya').value = "";
    
    yeniSecilenDosyalar = [];
    mevcutKalanDosyalar = [];
    dosyalariListeyeCiz();

    duzenlenenGorevId = null;
}

async function goreviSil(id) {
    try {
        await fetch("http://127.0.0.1:8000/gorev_sil/" + id, { method: "DELETE" });
        gorevler = gorevler.filter(g => g.id !== id);
        gorevleriEkranaYazdir();
        baloncukIceriginiGuncelleVeyaKapat();
    } catch(hata) {
        console.error("Silme hatası:", hata);
    }
}

async function baloncuktanKaydet() {
    const konu = document.getElementById('baloncukKonu').value;
    const icerik = document.getElementById('baloncukIcerik').value;

    if (konu === "" || icerik === "") {
        alert("Lütfen Konu ve Açıklama alanlarını doldurun.");
        return;
    }

    if (duzenlenenGorevId !== null) {
        const varOlanGorev = gorevler.find(g => g.id === duzenlenenGorevId);
        if(varOlanGorev) {
            
            const paket = new FormData();
            paket.append("baslik", konu);
            paket.append("aciklama", icerik);
            paket.append("durum", varOlanGorev.durum);
            
            paket.append("kalan_dosyalar", mevcutKalanDosyalar.join("|"));
            
            yeniSecilenDosyalar.forEach(dosya => {
                paket.append("dosyalar", dosya);
            });

            try {
                const cevap = await fetch("http://127.0.0.1:8000/gorev_guncelle/" + duzenlenenGorevId, {
                    method: "PUT",
                    body: paket
                });

                if (cevap.ok) {
                    const sonuc = await cevap.json();
                    varOlanGorev.baslik = konu;
                    varOlanGorev.aciklama = icerik;
                    varOlanGorev.dosya_adresi = sonuc.dosya_adresi; 
                }
            } catch (hata) {
                console.error("Güncelleme hatası", hata);
            }
        }
        baloncuguKapat();
        gorevleriEkranaYazdir(); 
        baloncukIceriginiGuncelleVeyaKapat();
    } 
    else {
        const kargoPaketi = new FormData();
        kargoPaketi.append("kullanici_id", aktifKullaniciId); 
        kargoPaketi.append("baslik", konu);
        kargoPaketi.append("aciklama", icerik);
        kargoPaketi.append("tarih", seciliTarihBilgisi);
        kargoPaketi.append("gunNo", seciliGunNumarasi);
        kargoPaketi.append("ayNo", seciliAyBilgisi);
        kargoPaketi.append("yilNo", seciliYilBilgisi);
        
        yeniSecilenDosyalar.forEach(dosya => {
            kargoPaketi.append("dosyalar", dosya);
        });

        try {
            const cevap = await fetch("http://127.0.0.1:8000/gorev_ekle", {
                method: "POST",
                body: kargoPaketi
            });

            if (cevap.ok) {
                const sonuc = await cevap.json();
                
                const yeniGorev = {
                    id: sonuc.gorev_id, 
                    baslik: konu,
                    aciklama: icerik,
                    tarih: seciliTarihBilgisi, 
                    gunNo: seciliGunNumarasi, 
                    ayNo: seciliAyBilgisi,     
                    yilNo: seciliYilBilgisi,   
                    durum: false,
                    dosya_adresi: sonuc.dosya_adresi
                };
                
                gorevler.push(yeniGorev); 
                baloncuguKapat();
                gorevleriEkranaYazdir(); 
                baloncukIceriginiGuncelleVeyaKapat();
            }
        } catch (hata) {
            alert("Sisteme ulaşılamıyor, arka planın çalıştığından emin olun.");
        }
    }
}

function takvimiRenklendir() {
    const simdi = new Date();
    // Saati sıfırlayarak sadece gün bazında hesaplama yapıyoruz
    const bugunTarihi = new Date(simdi.getFullYear(), simdi.getMonth(), simdi.getDate());

    const tumKutular = document.querySelectorAll('.takvim-gunu');
    tumKutular.forEach(function(kutu) {
        // Tüm renk sınıflarını temizle
        kutu.classList.remove('gun-yesil', 'gun-sari', 'gun-kirmizi', 'gecmis-gorev-cercevesi'); 
        kutu.removeAttribute('data-konu'); 
    });

    gorevler.forEach(function(gorev) {
        if (!gorev.durum) { 
            const kutu = document.getElementById('takvim-kutu-' + gorev.yilNo + '-' + gorev.ayNo + '-' + gorev.gunNo);
            
            if (kutu) {
                let mevcutKonu = kutu.getAttribute('data-konu');
                if (mevcutKonu) {
                    kutu.setAttribute('data-konu', mevcutKonu + " & " + gorev.baslik); 
                } else {
                    kutu.setAttribute('data-konu', gorev.baslik);
                }

                const gorevTarihi = new Date(gorev.yilNo, gorev.ayNo, gorev.gunNo);
                const zamanFarki = gorevTarihi.getTime() - bugunTarihi.getTime();
                const kalanGunFarki = Math.ceil(zamanFarki / (1000 * 3600 * 24));

                // YENİ DÜZENLEME: Kullanıcının isteği üzerine GEÇMİŞ günlerin içi kırmızı OLMAYACAK, sadece siyah çerçeve olacak
                if (kalanGunFarki < 0) {
                    // 1. Durum: Gün geçmişte kalmış (Sadece siyah çerçeve eklenir)
                    kutu.classList.add('gecmis-gorev-cercevesi');
                    kutu.classList.remove('gun-yesil', 'gun-sari', 'gun-kirmizi'); 
                }
                else if (kalanGunFarki >= 0 && kalanGunFarki <= 3) {
                    // 2. Durum: Bugün veya son 3 gün kalmış (Kırmızı Uyarı)
                    kutu.classList.add('gun-kirmizi');
                    kutu.classList.remove('gun-yesil', 'gun-sari', 'gecmis-gorev-cercevesi'); 
                }
                else if (kalanGunFarki > 3 && kalanGunFarki <= 5) {
                    // 3. Durum: 3 ile 5 gün arası kalmış (Sarı Uyarı)
                    if (!kutu.classList.contains('gun-kirmizi') && !kutu.classList.contains('gecmis-gorev-cercevesi')) {
                        kutu.classList.add('gun-sari');
                        kutu.classList.remove('gun-yesil'); 
                    }
                } 
                else if (kalanGunFarki > 5) {
                    // 4. Durum: 5 günden daha fazla zaman var (Yeşil Uyarı)
                    if (!kutu.classList.contains('gun-kirmizi') && !kutu.classList.contains('gun-sari') && !kutu.classList.contains('gecmis-gorev-cercevesi')) {
                        kutu.classList.add('gun-yesil');
                    }
                }
            }
        }
    });
}

function dosyalariGosterGizle(id) {
    const alan = document.getElementById('dosyalar-' + id);
    if (alan) {
        alan.classList.toggle('gizli');
    }
}

function gorevleriEkranaYazdir() {
    const takvimAltiAlani = document.getElementById('takvimAltiGorevler');
    if (takvimAltiAlani) takvimAltiAlani.innerHTML = '';

    if (gorevler.length === 0) {
        if (takvimAltiAlani) takvimAltiAlani.innerHTML = '<p>Henüz bir plan eklenmedi.</p>';
        takvimiRenklendir(); 
        return; 
    }

    gorevler.sort(function(a, b) {
        const tarihA = new Date(a.yilNo, a.ayNo, a.gunNo).getTime();
        const tarihB = new Date(b.yilNo, b.ayNo, b.gunNo).getTime();
        return tarihA - tarihB; 
    });

    gorevler.forEach(function(gorev) {
        const tamamlandiSinifi = gorev.durum ? 'gorev-tamamlandi' : '';
        const butonMetni = gorev.durum ? 'İptal Et (Geri Al)' : 'Tamamlandı İşaretle';

        let dosyaEkiHTML = "";
        
        if (gorev.dosya_adresi) {
            const dosyalarArray = gorev.dosya_adresi.split('|');
            const dosyaSayisi = dosyalarArray.length;
            
            dosyaEkiHTML += `<button class="dosya-goster-gizle-btn" onclick="dosyalariGosterGizle(${gorev.id})">📎 ${dosyaSayisi} Ek Dosyayı Göster/Gizle 🔽</button>`;
            dosyaEkiHTML += `<div id="dosyalar-${gorev.id}" class="gorev-dosyalari-grid gizli">`;
            
            dosyalarArray.forEach(dosyaIsmi => {
                const dosyaUrl = "http://127.0.0.1:8000/dosyalar/" + encodeURIComponent(dosyaIsmi);
                const kucukHarfliIsim = dosyaIsmi.toLowerCase();
                const isPdf = kucukHarfliIsim.endsWith(".pdf");
                
                if (!isPdf) {
                    dosyaEkiHTML += `<div><a href="${dosyaUrl}" target="_blank"><img src="${dosyaUrl}" class="gorsel-onizleme"></a></div>`;
                } else {
                    const kisaIsim = dosyaIsmi.length > 15 ? dosyaIsmi.substring(0,15) + "..." : dosyaIsmi;
                    dosyaEkiHTML += `<div><a href="${dosyaUrl}" target="_blank" class="pdf-butonu" title="${dosyaIsmi}">📄 ${kisaIsim}</a></div>`;
                }
            });
            dosyaEkiHTML += `</div>`;
        }

        const gorevHTML = `
            <div class="gorev-karti ${tamamlandiSinifi}">
                <div class="karti-baslik-alani">
                    <h3>${gorev.baslik}</h3>
                    <div class="ikon-grubu">
                        <span onclick="listedenGoreviDuzenle(${gorev.id})" title="Düzenle">✏️</span>
                        <span onclick="goreviSil(${gorev.id})" title="Sil">🗑️</span>
                    </div>
                </div>
                <p><strong>${gorev.tarih} :</strong> ${gorev.aciklama}</p>
                ${dosyaEkiHTML}
                <br>
                <button onclick="gorevDurumuDegistir(${gorev.id})">${butonMetni}</button>
            </div>
        `;
        
        if (takvimAltiAlani) takvimAltiAlani.innerHTML += gorevHTML; 
    });

    takvimiRenklendir();
}

async function gorevDurumuDegistir(id) {
    const gorev = gorevler.find(g => g.id === id);
    if (gorev) {
        gorev.durum = !gorev.durum; 
        
        const paket = new FormData();
        paket.append("baslik", gorev.baslik);
        paket.append("aciklama", gorev.aciklama);
        paket.append("durum", gorev.durum);
        
        if (gorev.dosya_adresi) {
            paket.append("kalan_dosyalar", gorev.dosya_adresi);
        }

        try {
            await fetch("http://127.0.0.1:8000/gorev_guncelle/" + id, {
                method: "PUT",
                body: paket
            });
        } catch(e) { console.log(e); }
    }
    
    gorevleriEkranaYazdir();
    baloncukIceriginiGuncelleVeyaKapat();
}