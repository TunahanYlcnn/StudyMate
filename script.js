// Görevlerimizi saklayacağımız boş liste (Veri Yapısı)
let gorevler = [];

let gosterilenAy = new Date().getMonth();
let gosterilenYil = new Date().getFullYear();

// Hangi görevi düzenlediğimizi bilgisayarın unutmaması için hafıza
let duzenlenenGorevId = null;

window.onload = function () {
    zamanGuncelle();
    setInterval(zamanGuncelle, 1000);
    takvimOlustur();
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
    sayfalar.forEach(function (sayfaId) {
        document.getElementById(sayfaId).classList.add('gizli');
    });
    document.getElementById(hedefSayfaId).classList.remove('gizli');
    baloncuguKapat();
}

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
// TAKVİM VE AY DEĞİŞTİRME SİSTEMİ
// ==========================================
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
        gunKutusu.onclick = function (olay) { baloncukAc(olay, pGun, oncekiAy, oncekiYil); };
        izgara.appendChild(gunKutusu);
    }

    for (let gun = 1; gun <= aydakiGunSayisi; gun++) {
        const gunKutusu = document.createElement('div');
        gunKutusu.className = 'takvim-gunu';
        gunKutusu.id = 'takvim-kutu-' + gosterilenYil + '-' + gosterilenAy + '-' + gun;
        gunKutusu.textContent = gun;
        if (gun === gercekBugununGunu && gosterilenAy === gercekBugununAyi && gosterilenYil === gercekBugununYili) {
            gunKutusu.classList.add('bugun-cercevesi');
        }
        gunKutusu.onclick = function (olay) { baloncukAc(olay, gun, gosterilenAy, gosterilenYil); };
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
        gunKutusu.onclick = function (olay) { baloncukAc(olay, i, sonrakiAy, sonrakiYil); };
        izgara.appendChild(gunKutusu);
    }
    takvimiRenklendir();
}

// ==========================================
// YENİ: DIŞARI TIKLANINCA OTOMATİK KAYDETME VE KAPATMA
// ==========================================
document.addEventListener('click', function (olay) {
    const baloncuk = document.getElementById('gorevBaloncugu');

    // Eğer baloncuk açık durumdaysa...
    if (!baloncuk.classList.contains('gizli-tamamen')) {
        // Eğer tıklanan yer baloncuğun İÇİNDE DEĞİLSE ve TAKVİM GÜNÜ DEĞİLSE (Otomatik kapanmasını sağlar)
        if (!baloncuk.contains(olay.target) && !olay.target.classList.contains('takvim-gunu') && !olay.target.classList.contains('pasif-gun')) {

            const formAlani = document.getElementById('baloncukFormAlani');

            // Eğer form alanı açıksa (yeni görev ekliyorsak veya düzenliyorsak) değişiklikleri otomatik kaydet
            if (!formAlani.classList.contains('gizli')) {
                const konu = document.getElementById('baloncukKonu').value;
                const icerik = document.getElementById('baloncukIcerik').value;

                // İkisi de doluysa kaydet ve kapat, boşlarsa sadece kapat
                if (konu.trim() !== "" && icerik.trim() !== "") {
                    baloncuktanKaydet();
                } else {
                    baloncuguKapat();
                }
            } else {
                // Form değil de sadece liste açıksa direkt kapat
                baloncuguKapat();
            }
        }
    }
});

// ==========================================
// DİNAMİK BALONCUK, SİLME VE DÜZENLEME SİSTEMİ
// ==========================================

// Baloncuk içindeki listeyi anlık yenileyen fonksiyon (Silme ve Tiklama işlemleri için)
function baloncukIceriginiGuncelleVeyaKapat() {
    const baloncuk = document.getElementById('gorevBaloncugu');
    if (baloncuk.classList.contains('gizli-tamamen')) return;

    const oGunkuGorevler = gorevler.filter(g => g.gunNo === seciliGunNumarasi && g.ayNo === seciliAyBilgisi && g.yilNo === seciliYilBilgisi);
    const listeAlani = document.getElementById('baloncukMevcutGorevler');
    const formAlani = document.getElementById('baloncukFormAlani');
    const yeniGorevBtn = document.getElementById('baloncukYeniGorevBtn');

    // Eğer form açık değilse (listeye bakıyorsak) ekranı yenile
    if (!yeniGorevBtn.classList.contains('gizli')) {
        listeAlani.innerHTML = '';

        if (oGunkuGorevler.length > 0) {
            oGunkuGorevler.forEach(gorev => {
                const satir = document.createElement('div');
                satir.className = 'baloncuk-gorev-satiri';

                // YENİ: Durum ikonları (Yapılmadıysa Çarpı ❌, Yapıldıysa Yeşil Tik ✅)
                const durumIkonu = gorev.durum ? '✅' : '❌';
                const yaziEfecti = gorev.durum ? 'ustu-cizili' : '';

                // Kalem, Çöp Kutusu ve Durum ikonları eklendi
                satir.innerHTML = `
                    <span class="${yaziEfecti}">${gorev.baslik}</span>
                    <div class="ikon-grubu">
                        <span onclick="gorevDurumuDegistir(${gorev.id})" title="Durumu Değiştir">${durumIkonu}</span>
                        <span onclick="goreviDuzenle(${gorev.id})" title="Düzenle">✏️</span>
                        <span onclick="goreviSil(${gorev.id})" title="Sil">🗑️</span>
                    </div>
                `;
                listeAlani.appendChild(satir);
            });
        } else {
            // Eğer silme işlemi sonrası o gün hiç görev kalmadıysa baloncuğu kapat
            baloncuguKapat();
        }
    }
}

function baloncukAc(olay, gun, ay, yil) {
    const baloncuk = document.getElementById('gorevBaloncugu');
    const tiklananGun = olay.target;
    const kordinat = tiklananGun.getBoundingClientRect();

    baloncuk.style.left = (kordinat.left + window.scrollX + (kordinat.width / 2)) + 'px';
    baloncuk.style.top = (kordinat.top + window.scrollY - 10) + 'px';
    baloncuk.classList.remove('gizli-tamamen');

    seciliGunNumarasi = gun;
    seciliAyBilgisi = ay;
    seciliYilBilgisi = yil;
    const ayIsimleri = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
    seciliTarihBilgisi = gun + " " + ayIsimleri[ay] + " " + yil;

    const oGunkuGorevler = gorevler.filter(g => g.gunNo === gun && g.ayNo === ay && g.yilNo === yil);

    const listeAlani = document.getElementById('baloncukMevcutGorevler');
    const yeniGorevBtn = document.getElementById('baloncukYeniGorevBtn');
    const formAlani = document.getElementById('baloncukFormAlani');

    listeAlani.innerHTML = '';
    duzenlenenGorevId = null;
    document.getElementById('baloncukKonu').value = "";
    document.getElementById('baloncukIcerik').value = "";

    if (oGunkuGorevler.length > 0) {
        formAlani.classList.add('gizli');
        yeniGorevBtn.classList.remove('gizli');
        // Listeyi çizdir
        baloncukIceriginiGuncelleVeyaKapat();
    } else {
        formAlani.classList.remove('gizli');
        yeniGorevBtn.classList.add('gizli');
    }
}

function yeniGorevFormunuAc() {
    document.getElementById('baloncukKonu').value = "";
    document.getElementById('baloncukIcerik').value = "";
    duzenlenenGorevId = null;
    document.getElementById('baloncukFormAlani').classList.remove('gizli');
    document.getElementById('baloncukYeniGorevBtn').classList.add('gizli');
}

function goreviDuzenle(id) {
    const gorev = gorevler.find(g => g.id === id);
    if (gorev) {
        document.getElementById('baloncukKonu').value = gorev.baslik;
        document.getElementById('baloncukIcerik').value = gorev.aciklama;
        duzenlenenGorevId = id;
        document.getElementById('baloncukFormAlani').classList.remove('gizli');
        document.getElementById('baloncukYeniGorevBtn').classList.add('gizli');
    }
}

// YENİ: Çöp Kutusu İkonuna Tıklayınca Çalışan Sistem
function goreviSil(id) {
    // Tıkladığımız id'yi hariç tutarak listeyi yeniden oluşturuyoruz (Silme mantığı)
    gorevler = gorevler.filter(g => g.id !== id);

    // Ekranı ve baloncuğun içini güncelliyoruz
    gorevleriEkranaYazdir();
    baloncukIceriginiGuncelleVeyaKapat();
}

function baloncuguKapat() {
    document.getElementById('gorevBaloncugu').classList.add('gizli-tamamen');
    document.getElementById('baloncukKonu').value = "";
    document.getElementById('baloncukIcerik').value = "";
    duzenlenenGorevId = null;
}

// ==========================================
// BALONCUKTAN VERİ KAYDETME / GÜNCELLEME
// ==========================================
function baloncuktanKaydet() {
    const konu = document.getElementById('baloncukKonu').value;
    const icerik = document.getElementById('baloncukIcerik').value;

    if (konu === "" || icerik === "") {
        alert("Lütfen Konu ve Açıklama alanlarını doldurun.");
        return;
    }

    if (duzenlenenGorevId !== null) {
        const varOlanGorev = gorevler.find(g => g.id === duzenlenenGorevId);
        if (varOlanGorev) {
            varOlanGorev.baslik = konu;
            varOlanGorev.aciklama = icerik;
        }
    } else {
        const yeniGorev = {
            id: Date.now(),
            baslik: konu,
            aciklama: icerik,
            tarih: seciliTarihBilgisi,
            gunNo: seciliGunNumarasi,
            ayNo: seciliAyBilgisi,
            yilNo: seciliYilBilgisi,
            durum: false
        };
        gorevler.push(yeniGorev);
    }

    baloncuguKapat();
    gorevleriEkranaYazdir();
}

// ==========================================
// GERÇEK ZAMANLI RENKLENDİRME
// ==========================================
function takvimiRenklendir() {
    const simdi = new Date();
    const bugunTarihi = new Date(simdi.getFullYear(), simdi.getMonth(), simdi.getDate());

    const tumKutular = document.querySelectorAll('.takvim-gunu');
    tumKutular.forEach(function (kutu) {
        kutu.classList.remove('gun-yesil', 'gun-sari', 'gun-kirmizi');
        kutu.removeAttribute('data-konu');
    });

    gorevler.forEach(function (gorev) {
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

// ==========================================
// GÖREVLERİ EKRANA ÇİZDİRME VE DURUM DEĞİŞTİRME
// ==========================================
function gorevleriEkranaYazdir() {
    const takvimAltiAlani = document.getElementById('takvimAltiGorevler');
    if (takvimAltiAlani) takvimAltiAlani.innerHTML = '';

    if (gorevler.length === 0) {
        if (takvimAltiAlani) takvimAltiAlani.innerHTML = '<p>Henüz bir plan eklenmedi.</p>';
        takvimiRenklendir();
        return;
    }

    gorevler.sort(function (a, b) {
        const tarihA = new Date(a.yilNo, a.ayNo, a.gunNo).getTime();
        const tarihB = new Date(b.yilNo, b.ayNo, b.gunNo).getTime();
        return tarihA - tarihB;
    });

    gorevler.forEach(function (gorev) {
        const tamamlandiSinifi = gorev.durum ? 'gorev-tamamlandi' : '';
        const butonMetni = gorev.durum ? 'İptal Et (Geri Al)' : 'Tamamlandı İşaretle';

        const gorevHTML = `
            <div class="gorev-karti ${tamamlandiSinifi}">
                <h3>${gorev.baslik}</h3>
                <p><strong>${gorev.tarih} :</strong> ${gorev.aciklama}</p>
                <button onclick="gorevDurumuDegistir(${gorev.id})">${butonMetni}</button>
            </div>
        `;

        if (takvimAltiAlani) takvimAltiAlani.innerHTML += gorevHTML;
    });

    takvimiRenklendir();
}

function gorevDurumuDegistir(id) {
    gorevler.forEach(function (gorev) {
        if (gorev.id === id) {
            gorev.durum = !gorev.durum;
        }
    });

    // Aşağıdaki listeyi yeniler
    gorevleriEkranaYazdir();

    // YENİ: Baloncuk açıksa onun içindeki Tik ve Çarpı ikonlarını da anında yeniler
    baloncukIceriginiGuncelleVeyaKapat();
}