# 📚 StudyMate - Akıllı Görev ve Ders Takip Sistemi

StudyMate, öğrencilerin ve profesyonellerin günlük görevlerini, ders notlarını ve dosyalarını (PDF/Resim) takvim tabanlı modern bir arayüzle yönetmelerini sağlayan tam teşekküllü (Full-Stack) bir web uygulamasıdır.

## ✨ Öne Çıkan Özellikler

* **Kullanıcı Kimlik Doğrulama (Auth):** Kişiselleştirilmiş deneyim için güvenli Kayıt Ol ve Giriş Yap sistemi. Tarayıcı hafızası (Local Storage) ile "Beni Hatırla" özelliği.
* **Akıllı Takvim ve Renk Uyarı Sistemi:** 
  * Görevlerin teslim tarihine göre otomatik renklendirme (Yeşil: Güvenli, Sarı: Yaklaşıyor, Kırmızı: Acil).
  * Geçmişte kalan ve tamamlanmayan görevler için **siyah çerçeveli uyarı sistemi**.
* **Gelişmiş Çoklu Dosya Yönetimi:** 
  * Aynı göreve birden fazla Resim ve PDF ekleyebilme.
  * Resimler için şık önizleme (thumbnail) ve PDF'ler için yönlendirme butonları.
  * Ekranı yormayan "Akordeon (Açılır/Kapanır)" dosya listeleme UX tasarımı.
  * Dosyaların fiziksel olarak sunucudan da silinmesini sağlayan akıllı çöp kutusu yönetimi.
* **Modern Modal UX:** Ekrandan taşmaları önleyen, arka planı karartılmış tam merkezli şık açılır pencereler (Modal).

## 🛠 Kullanılan Teknolojiler

**Ön Yüz (Frontend)**
* HTML5 & CSS3 (Modern ve Responsive Tasarım, CSS Grid/Flexbox)
* Vanilla JavaScript (ES6+, Async/Await, Fetch API, FormData)

**Arka Plan (Backend)**
* Python 3
* FastAPI (Hızlı ve modern API altyapısı)
* SQLAlchemy (ORM - Object Relational Mapping)

**Veritabanı & Sunucu (Database & DevOps)**
* PostgreSQL
* Docker & Docker Compose (İzole ve kalıcı veritabanı yönetimi)

---

## 🚀 Kurulum ve Çalıştırma (Sıfır Kurulum Yöntemi)

Projeyi Docker sayesinde kütüphane kurulumlarıyla uğraşmadan, saniyeler içinde çalıştırabilirsiniz.

### 1. Gereksinimler
Bilgisayarınızda Docker Desktop kurulu ve çalışır durumda olmalıdır.

### 2. Sistemi Tek Komutla Başlatma
Projenin kütüphanelerini, veritabanını ve sunucusunu tek seferde hazır hale getirmek için:

1. Proje ana klasöründe bir terminal (CMD/PowerShell) açın.

2. Aşağıdaki komutu çalıştırın:
```bash
docker-compose up --build -d
```

### 4. Ön Yüzü Çalıştırma

1. Ana proje klasöründeki index.html dosyasını VS Code vb. bir editör ile açın.
2. Live Server eklentisi ile (veya dosyaya çift tıklayarak) tarayıcıda çalıştırın.
3. Çıkan ekranda yeni bir hesap oluşturup sistemi kullanmaya başlayabilirsiniz!

```text
StudyMate/
│
├── index.html          # Uygulama ana ekranı ve Modal yapıları
├── style.css           # Modern UX/UI tasarımları ve Grid sistemleri
├── script.js           # Frontend mantığı, Fetch API istekleri ve DOM manipülasyonu
│
└── arka_plan/          # Backend (FastAPI & Veritabanı)
    ├── main.py         # API Rotaları (CRUD, Dosya işlemleri, Auth)
    ├── database.py     # PostgreSQL bağlantısı ve ORM modelleri
    ├── docker-compose.yml # PostgreSQL Docker yapılandırması
    └── yuklenen_dosyalar/ # Kullanıcı yüklemeleri (PDF / Görsel)
```



