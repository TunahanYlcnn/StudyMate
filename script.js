// Görevlerimizi saklayacağımız boş liste (Veri Yapısı)
let gorevler = [];

// Takvimde HANGİ ayın ve yılın gösterildiğini takip eden değişkenler
let gosterilenAy = new Date().getMonth(); // 0'dan başlar (0=Ocak, 11=Aralık)
let gosterilenYil = new Date().getFullYear();

// Sistemi başlattığımızda Saat ve Takvim fonksiyonlarını çalıştırıyoruz
window.onload = function () {
    zamanGuncelle();
    setInterval(zamanGuncelle, 1000); // Her 1 saniyede bir saati günceller
    takvimOlustur();
};

// ==========================================
// ZAMAN VE TARİH GÜNCELLEME SİSTEMİ
// ==========================================
function zamanGuncelle() {
    const simdi = new Date();

    // Üst bardaki ortada bulunan yazı: Gerçek bugünün tarihidir
    const seceneklerTarih = { day: 'numeric', month: 'long', year: 'numeric' };
    document.getElementById('tarihYazisi').textContent = "Bugün: " + simdi.toLocaleDateString('tr-TR', seceneklerTarih);

    // Saati ve Dakikayı alıp arasına : koyuyoruz
    const saat = simdi.getHours().toString().padStart(2, '0');
    const dakika = simdi.getMinutes().toString().padStart(2, '0');
    document.getElementById('saatYazisi').textContent = saat + ":" + dakika;
}

// ==========================================
// SAYFA GEÇİŞ SİSTEMİ
// ==========================================
function sayfaGoster(hedefSayfaId) {
    const sayfalar = ['girisSayfasi', 'planlamaSayfasi'];
    sayfalar.forEach(function (sayfaId) {
        document.getElementById(sayfaId).classList.add('gizli');
    });
    document.getElementById(hedefSayfaId).classList.remove('gizli');
    baloncuguKapat();
}

// ==========================================
// GİRİŞ YAPMA VE ÇIKIŞ SİSTEMİ
// ==========================================
document.getElementById('girisFormu').addEventListener('submit', function (olay) {
    olay.preventDefault();
    document.getElementById('anaMenu').classList.remove('gizli');
    sayfaGoster('planlamaSayfasi');
});

function cikisYap() {
    document.getElementById('anaMenu').classList.add('gizli');
    sayfaGoster('girisSayfasi');
}

// ==========================================
// TAKVİM, AY DEĞİŞTİRME VE BALONCUK SİSTEMİ
// ==========================================
let seciliTarihBilgisi = "";
let seciliGunNumarasi = 0;
// Görevi kaydederken hangi aya ait olduğunu bilelim diye ekledik
let seciliAyBilgisi = 0;
let seciliYilBilgisi = 0;

function takvimiAcKapat() {
    const icerik = document.getElementById('takvimIcerik');
    const ok = document.getElementById('takvimOku');
    icerik.classList.toggle('gizli-takvim');
    ok.classList.toggle('ok-donmus');
}

// Önceki/Sonraki ay tuşlarına basıldığında çalışan sistem
function ayDegistir(yon) {
    gosterilenAy += yon;

    // Eğer Aralık ayından (11) sonraya geçersek, yılı artır ve Ocak (0) yap
    if (gosterilenAy > 11) {
        gosterilenAy = 0;
        gosterilenYil++;
    }
    // Eğer Ocak ayından (0) geriye gidersek, yılı azalt ve Aralık (11) yap
    else if (gosterilenAy < 0) {
        gosterilenAy = 11;
        gosterilenYil--;
    }

    // Değişiklik sonrası takvimi o aya göre baştan çizdiriyoruz
    takvimOlustur();
    baloncuguKapat();
}

function takvimOlustur() {
    const izgara = document.getElementById('takvimIzgarasi');
    izgara.innerHTML = '';

    // Hangi günde olduğumuzu sistemden alıyoruz (Sadece kırmızı çerçeve için)
    const simdi = new Date();
    const gercekBugununGunu = simdi.getDate();
    const gercekBugununAyi = simdi.getMonth();
    const gercekBugununYili = simdi.getFullYear();

    // Gösterilen ayın kaç çektiğini (kaç gün olduğunu) hesaplatıyoruz
    const aydakiGunSayisi = new Date(gosterilenYil, gosterilenAy + 1, 0).getDate();

    // YENİ: Ayın ilk gününün hangi güne denk geldiğini buluyoruz (0: Pazar, 1: Pazartesi...)
    let ilkGun = new Date(gosterilenYil, gosterilenAy, 1).getDay();
    // Pazartesiyi haftanın 1. günü yapmak için matematiksel ayarlama
    ilkGun = ilkGun === 0 ? 6 : ilkGun - 1;

    // YENİ: Bir önceki ayın kaç çektiğini buluyoruz ki soluk günleri yazabilelim
    const oncekiAyGunSayisi = new Date(gosterilenYil, gosterilenAy, 0).getDate();

    // Ay başlığını güncelliyoruz
    const ayIsimleri = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
    document.getElementById('gosterilenAyYazisi').textContent = ayIsimleri[gosterilenAy] + " " + gosterilenYil;

    // YENİ: 1. AŞAMA - Önceki ayın günlerini (Pasif/Soluk) çizdiriyoruz
    for (let i = ilkGun - 1; i >= 0; i--) {
        const gunKutusu = document.createElement('div');
        gunKutusu.className = 'takvim-gunu pasif-gun';
        gunKutusu.textContent = oncekiAyGunSayisi - i;
        izgara.appendChild(gunKutusu);
    }

    // 2. AŞAMA - Bu ayın gerçek günlerini çizdiriyoruz
    for (let gun = 1; gun <= aydakiGunSayisi; gun++) {
        const gunKutusu = document.createElement('div');
        gunKutusu.className = 'takvim-gunu';
        gunKutusu.id = 'takvim-gun-' + gun;
        gunKutusu.textContent = gun;

        // EĞER ÇİZDİĞİMİZ GÜN GERÇEK BUGÜNE EŞİTSE KIRMIZI ÇERÇEVE EKLE
        if (gun === gercekBugununGunu && gosterilenAy === gercekBugununAyi && gosterilenYil === gercekBugununYili) {
            gunKutusu.classList.add('bugun-cercevesi');
        }

        gunKutusu.onclick = function (olay) {
            baloncukAc(olay, gun);
        };
        izgara.appendChild(gunKutusu);
    }

    // YENİ: 3. AŞAMA - Takvimde boş kalan son kısımları Sonraki Ayın günleriyle tamamlıyoruz
    const toplamHucre = ilkGun + aydakiGunSayisi;
    const kalanHucre = (7 - (toplamHucre % 7)) % 7; // Haftayı 7'ye tamamlamak için gereken gün sayısı

    for (let i = 1; i <= kalanHucre; i++) {
        const gunKutusu = document.createElement('div');
        gunKutusu.className = 'takvim-gunu pasif-gun';
        gunKutusu.textContent = i;
        izgara.appendChild(gunKutusu);
    }

    // Takvim her yeniden çizildiğinde renkleri ve hover yazılarını geri getirir
    takvimiRenklendir();
}

function baloncukAc(olay, gun) {
    const baloncuk = document.getElementById('gorevBaloncugu');
    const tiklananGun = olay.target;

    const kordinat = tiklananGun.getBoundingClientRect();

    baloncuk.style.left = (kordinat.left + window.scrollX + (kordinat.width / 2)) + 'px';
    baloncuk.style.top = (kordinat.top + window.scrollY - 10) + 'px';

    baloncuk.classList.remove('gizli-tamamen');

    // Hangi günü ve ayı seçtiğimizi hafızaya alıyoruz
    seciliGunNumarasi = gun;
    seciliAyBilgisi = gosterilenAy;
    seciliYilBilgisi = gosterilenYil;

    const ayIsimleri = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
    seciliTarihBilgisi = gun + " " + ayIsimleri[gosterilenAy] + " " + gosterilenYil;
}

function baloncuguKapat() {
    document.getElementById('gorevBaloncugu').classList.add('gizli-tamamen');
    document.getElementById('baloncukKonu').value = "";
    document.getElementById('baloncukIcerik').value = "";
}

// ==========================================
// BALONCUKTAN VERİ KAYDETME
// ==========================================
function baloncuktanKaydet() {
    const konu = document.getElementById('baloncukKonu').value;
    const icerik = document.getElementById('baloncukIcerik').value;

    if (konu === "" || icerik === "") {
        alert("Lütfen Konu ve Açıklama alanlarını doldurun.");
        return;
    }

    // Eski yapıyı bozmadan yeni görevi paketliyoruz
    const yeniGorev = {
        id: Date.now(),
        ders: "Takvim Notu",
        baslik: konu,
        aciklama: icerik,
        tarih: seciliTarihBilgisi,
        gunNo: seciliGunNumarasi,
        ayNo: seciliAyBilgisi,
        yilNo: seciliYilBilgisi,
        durum: false
    };

    gorevler.push(yeniGorev);
    baloncuguKapat();
    gorevleriEkranaYazdir();
}

// ==========================================
// GERÇEK ZAMANLI RENKLENDİRME VE HOVER YAZISI EKLEME
// ==========================================
function takvimiRenklendir() {
    const simdi = new Date();
    // Tam şu anki gece yarısı tarihini alıyoruz ki saat farkları hesaplamayı bozmasın
    const bugunTarihi = new Date(simdi.getFullYear(), simdi.getMonth(), simdi.getDate());

    // Önce takvimdeki tüm eski renkleri ve Hover (üstüne gelince çıkan) yazılarını temizliyoruz
    for (let gun = 1; gun <= 31; gun++) {
        const kutu = document.getElementById('takvim-gun-' + gun);
        if (kutu) {
            kutu.classList.remove('gun-yesil', 'gun-sari', 'gun-kirmizi');
            kutu.removeAttribute('data-konu');
        }
    }

    gorevler.forEach(function (gorev) {
        if (!gorev.durum) {
            // SADECE şu an ekranda gösterilen aya ait görevleri takvimde renklendiririz
            if (gorev.ayNo === gosterilenAy && gorev.yilNo === gosterilenYil) {
                const kutu = document.getElementById('takvim-gun-' + gorev.gunNo);

                if (kutu) {
                    // Kutunun içine Konu ismini "data-konu" olarak yapıştırıyoruz
                    let mevcutKonu = kutu.getAttribute('data-konu');
                    if (mevcutKonu) {
                        kutu.setAttribute('data-konu', mevcutKonu + " & " + gorev.baslik);
                    } else {
                        kutu.setAttribute('data-konu', gorev.baslik);
                    }

                    // Görevin tam tarihini oluşturup bilgisayara matematiksel olarak çıkarttırıyoruz
                    const gorevTarihi = new Date(gorev.yilNo, gorev.ayNo, gorev.gunNo);
                    const zamanFarki = gorevTarihi.getTime() - bugunTarihi.getTime();
                    // Milisaniyeyi güne çevirme matematiği
                    const kalanGunFarki = Math.ceil(zamanFarki / (1000 * 3600 * 24));

                    // Şart 1: Göreve 7 gün veya daha fazla varsa (Yeşil)
                    if (kalanGunFarki >= 7) {
                        if (!kutu.classList.contains('gun-kirmizi') && !kutu.classList.contains('gun-sari')) {
                            kutu.classList.add('gun-yesil');
                        }
                    }
                    // Şart 2: Göreve 5 gün veya daha az kalmışsa (Sarı)
                    else if (kalanGunFarki <= 5 && kalanGunFarki > 3) {
                        if (!kutu.classList.contains('gun-kirmizi')) {
                            kutu.classList.add('gun-sari');
                            kutu.classList.remove('gun-yesil');
                        }
                    }
                    // Şart 3: Göreve 3 gün veya daha az kalmışsa VEYA ZAMAN GEÇMİŞSE (Kırmızı)
                    else if (kalanGunFarki <= 3) {
                        kutu.classList.add('gun-kirmizi');
                        kutu.classList.remove('gun-yesil', 'gun-sari');
                    }
                }
            }
        }
    });
}

// ==========================================
// GÖREVLERİ EKRANA ÇİZDİRME SİSTEMİ
// ==========================================
function gorevleriEkranaYazdir() {
    const takvimAltiAlani = document.getElementById('takvimAltiGorevler');

    if (takvimAltiAlani) takvimAltiAlani.innerHTML = '';

    if (gorevler.length === 0) {
        if (takvimAltiAlani) takvimAltiAlani.innerHTML = '<p>Henüz bir plan eklenmedi.</p>';
        takvimiRenklendir();
        return;
    }

    gorevler.forEach(function (gorev) {
        const tamamlandiSinifi = gorev.durum ? 'gorev-tamamlandi' : '';
        const butonMetni = gorev.durum ? 'İptal Et (Geri Al)' : 'Tamamlandı İşaretle';

        const gorevHTML = `
            <div class="gorev-karti ${tamamlandiSinifi}">
                <h3>${gorev.baslik}</h3>
                <p><strong>Tarih:</strong> ${gorev.tarih}</p>
                <p>${gorev.aciklama}</p>
                <button onclick="gorevDurumuDegistir(${gorev.id})">${butonMetni}</button>
            </div>
        `;

        if (takvimAltiAlani) takvimAltiAlani.innerHTML += gorevHTML;
    });

    takvimiRenklendir();
}

// ==========================================
// GÖREV DURUMUNU (BİTTİ/BİTMEDİ) DEĞİŞTİRME
// ==========================================
function gorevDurumuDegistir(id) {
    gorevler.forEach(function (gorev) {
        if (gorev.id === id) {
            gorev.durum = !gorev.durum;
        }
    });
    gorevleriEkranaYazdir();
}