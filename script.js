let gorevler = [];
let gosterilenAy = new Date().getMonth(); 
let gosterilenYil = new Date().getFullYear();
let duzenlenenGorevId = null;

// YENİ: Dosya silme ikonuna basılıp basılmadığını hatırlayan hafıza
let dosyaSilinecekMi = false; 

// Eski baloncukKonumGuncelle fonksiyonunun içi boşaltıldı çünkü Modal yapısına geçtik!
// Ancak değişken ve fonksiyon kuralları gereği yapısını koruyorum.
function baloncukKonumGuncelle() {
    return; // Modal kendi kendini tam ortaya hizaladığı için bu matematiğe gerek kalmadı.
}

window.addEventListener('resize', baloncukKonumGuncelle);

document.getElementById('baloncukDosya').addEventListener('change', function(e) {
    const isim = e.target.files[0] ? e.target.files[0].name : "Henüz dosya seçilmedi.";
    document.getElementById('secilenDosyaIsmi').textContent = "Seçilen: " + isim;
    // Yeni dosya seçildiyse silme uyarısını gizle ve sıfırla
    dosyaSilinecekMi = false;
    document.getElementById('dosyaSilBtn').classList.add('gizli');
    document.getElementById('secilenDosyaIsmi').style.color = "#777";
});

// YENİ: Çöp kutusuna tıklayınca çalışan fonksiyon
function mevcutDosyayiSilmeyiIsaretle() {
    dosyaSilinecekMi = true;
    document.getElementById('secilenDosyaIsmi').textContent = "Bu dosya kaydedilince silinecek!";
    document.getElementById('secilenDosyaIsmi').style.color = "red";
    document.getElementById('dosyaSilBtn').classList.add('gizli');
}

window.onload = async function() {
    zamanGuncelle();
    setInterval(zamanGuncelle, 1000); 
    takvimOlustur();
    
    try {
        const cevap = await fetch("http://127.0.0.1:8000/gorevler");
        if (cevap.ok) {
            gorevler = await cevap.json(); 
            gorevleriEkranaYazdir(); 
        }
    } catch (hata) {
        console.log("Sunucuya bağlanılamadı, görevler getirilemedi.");
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

function sayfaGoster(hedefSayfaId) {
    const sayfalar = ['girisSayfasi', 'planlamaSayfasi'];
    sayfalar.forEach(function(sayfaId) {
        document.getElementById(sayfaId).classList.add('gizli');
    });
    document.getElementById(hedefSayfaId).classList.remove('gizli');
    baloncuguKapat(); 
}

document.getElementById('girisFormu').addEventListener('submit', function(olay) {
    olay.preventDefault(); 
    document.getElementById('anaMenu').classList.remove('gizli');
    sayfaGoster('planlamaSayfasi'); 
});

function cikisYap() {
    document.getElementById('anaMenu').classList.add('gizli');
    sayfaGoster('girisSayfasi');
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

// YENİ: Dışarı tıklayınca kapatma mantığı güncellendi (Modal yapısına göre)
document.addEventListener('click', function(olay) {
    const baloncuk = document.getElementById('gorevBaloncugu');
    
    if (!baloncuk.classList.contains('gizli-tamamen')) {
        // Eğer kullanıcı doğrudan o karanlık arka plana tıkladıysa Modal'ı kapat/kaydet
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
                const dosyaEkiHTML = gorev.dosya_adresi ? `<span class="dosya-etiketi-kucuk">📎 Ek Dosya Var</span>` : '';
                
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

    const oGunkuGorevler = gorevler.filter(g => g.gunNo === gun && g.ayNo === ay && g.yilNo === yil);
    
    const listeAlani = document.getElementById('baloncukMevcutGorevler');
    const yeniGorevBtn = document.getElementById('baloncukYeniGorevBtn');
    const formAlani = document.getElementById('baloncukFormAlani');

    listeAlani.innerHTML = ''; 
    duzenlenenGorevId = null; 
    dosyaSilinecekMi = false; 
    document.getElementById('baloncukKonu').value = "";
    document.getElementById('baloncukIcerik').value = "";
    document.getElementById('baloncukDosya').value = ""; 
    document.getElementById('secilenDosyaIsmi').textContent = "Henüz dosya seçilmedi."; 
    document.getElementById('secilenDosyaIsmi').style.color = "#777";
    document.getElementById('dosyaSilBtn').classList.add('gizli');

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
    document.getElementById('secilenDosyaIsmi').textContent = "Henüz dosya seçilmedi.";
    document.getElementById('secilenDosyaIsmi').style.color = "#777";
    document.getElementById('dosyaSilBtn').classList.add('gizli');
    dosyaSilinecekMi = false;
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
        document.getElementById('secilenDosyaIsmi').style.color = "#777";
        dosyaSilinecekMi = false;
        
        if (gorev.dosya_adresi) {
            document.getElementById('secilenDosyaIsmi').textContent = "Mevcut Dosya: " + gorev.dosya_adresi;
            document.getElementById('dosyaSilBtn').classList.remove('gizli'); // Sil ikonunu göster
        } else {
            document.getElementById('secilenDosyaIsmi').textContent = "Henüz dosya seçilmedi.";
            document.getElementById('dosyaSilBtn').classList.add('gizli');
        }
        
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

        document.getElementById('baloncukKonu').value = gorev.baslik;
        document.getElementById('baloncukIcerik').value = gorev.aciklama;
        document.getElementById('baloncukDosya').value = ""; 
        document.getElementById('secilenDosyaIsmi').style.color = "#777";
        dosyaSilinecekMi = false;

        if (gorev.dosya_adresi) {
            document.getElementById('secilenDosyaIsmi').textContent = "Mevcut Dosya: " + gorev.dosya_adresi;
            document.getElementById('dosyaSilBtn').classList.remove('gizli');
        } else {
            document.getElementById('secilenDosyaIsmi').textContent = "Henüz dosya seçilmedi.";
            document.getElementById('dosyaSilBtn').classList.add('gizli');
        }
        
        duzenlenenGorevId = id; 
        document.getElementById('baloncukMevcutGorevler').innerHTML = ''; 
        document.getElementById('baloncukFormAlani').classList.remove('gizli'); 
        document.getElementById('baloncukYeniGorevBtn').classList.add('gizli');
    }
}

function baloncuguKapat() {
    document.getElementById('gorevBaloncugu').classList.add('gizli-tamamen');
    document.getElementById('baloncukKonu').value = "";
    document.getElementById('baloncukIcerik').value = "";
    document.getElementById('baloncukDosya').value = "";
    document.getElementById('secilenDosyaIsmi').textContent = "Henüz dosya seçilmedi.";
    document.getElementById('dosyaSilBtn').classList.add('gizli');
    dosyaSilinecekMi = false;
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
    
    const dosyaKutusu = document.getElementById('baloncukDosya');
    const secilenDosya = dosyaKutusu.files[0];

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
            
            // YENİ EKLENDİ: Dosyayı silme uyarısı Python'a gidiyor
            paket.append("dosya_sil", dosyaSilinecekMi);
            
            if (secilenDosya) {
                paket.append("dosya", secilenDosya);
            }

            try {
                const cevap = await fetch("http://127.0.0.1:8000/gorev_guncelle/" + duzenlenenGorevId, {
                    method: "PUT",
                    body: paket
                });

                if (cevap.ok) {
                    const sonuc = await cevap.json();
                    varOlanGorev.baslik = konu;
                    varOlanGorev.aciklama = icerik;
                    
                    if (dosyaSilinecekMi) {
                        varOlanGorev.dosya_adresi = null;
                        varOlanGorev.dosya_tipi = null;
                    }
                    
                    if (secilenDosya) {
                        varOlanGorev.dosya_adresi = sonuc.dosya_adresi;
                        varOlanGorev.dosya_tipi = sonuc.dosya_tipi;
                    }
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
        kargoPaketi.append("baslik", konu);
        kargoPaketi.append("aciklama", icerik);
        kargoPaketi.append("tarih", seciliTarihBilgisi);
        kargoPaketi.append("gunNo", seciliGunNumarasi);
        kargoPaketi.append("ayNo", seciliAyBilgisi);
        kargoPaketi.append("yilNo", seciliYilBilgisi);
        
        if (secilenDosya) {
            kargoPaketi.append("dosya", secilenDosya);
        }

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
                    dosya_adresi: sonuc.dosya_adresi, 
                    dosya_tipi: sonuc.dosya_tipi 
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
    const bugunTarihi = new Date(simdi.getFullYear(), simdi.getMonth(), simdi.getDate());

    const tumKutular = document.querySelectorAll('.takvim-gunu');
    tumKutular.forEach(function(kutu) {
        kutu.classList.remove('gun-yesil', 'gun-sari', 'gun-kirmizi');
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

                if (kalanGunFarki >= 7) {
                    if (!kutu.classList.contains('gun-kirmizi') && !kutu.classList.contains('gun-sari')) {
                        kutu.classList.add('gun-yesil');
                    }
                } 
                else if (kalanGunFarki <= 5 && kalanGunFarki > 3) {
                    if (!kutu.classList.contains('gun-kirmizi')) {
                        kutu.classList.add('gun-sari');
                        kutu.classList.remove('gun-yesil'); 
                    }
                } 
                else if (kalanGunFarki <= 3) {
                    kutu.classList.add('gun-kirmizi');
                    kutu.classList.remove('gun-yesil', 'gun-sari'); 
                }
            }
        }
    });
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
            const dosyaUrl = "http://127.0.0.1:8000/dosyalar/" + encodeURIComponent(gorev.dosya_adresi);
            
            if (gorev.dosya_tipi === "resim") {
                dosyaEkiHTML = `<div><a href="${dosyaUrl}" target="_blank"><img src="${dosyaUrl}" class="gorsel-onizleme"></a></div>`;
            } else {
                dosyaEkiHTML = `<div><a href="${dosyaUrl}" target="_blank" class="pdf-butonu">📄 PDF Dosyasını Görüntüle</a></div>`;
            }
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