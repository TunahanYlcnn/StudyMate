\# 📚 StudyMate - Akıllı Görev ve Ders Takip Sistemi



StudyMate, öğrencilerin ve profesyonellerin günlük görevlerini, ders notlarını ve dosyalarını (PDF/Resim) takvim tabanlı modern bir arayüzle yönetmelerini sağlayan tam teşekküllü (Full-Stack) bir web uygulamasıdır.



\## ✨ Öne Çıkan Özellikler



\* \*\*Kullanıcı Kimlik Doğrulama (Auth):\*\* Kişiselleştirilmiş deneyim için güvenli Kayıt Ol ve Giriş Yap sistemi. Tarayıcı hafızası (Local Storage) ile "Beni Hatırla" özelliği.

\* \*\*Akıllı Takvim ve Renk Uyarı Sistemi:\*\* 

&#x20; \* Görevlerin teslim tarihine göre otomatik renklendirme (Yeşil: Güvenli, Sarı: Yaklaşıyor, Kırmızı: Acil).

&#x20; \* Geçmişte kalan ve tamamlanmayan görevler için \*\*siyah çerçeveli uyarı sistemi\*\*.

\* \*\*Gelişmiş Çoklu Dosya Yönetimi:\*\* 

&#x20; \* Aynı göreve birden fazla Resim ve PDF ekleyebilme.

&#x20; \* Resimler için şık önizleme (thumbnail) ve PDF'ler için yönlendirme butonları.

&#x20; \* Ekranı yormayan "Akordeon (Açılır/Kapanır)" dosya listeleme UX tasarımı.

&#x20; \* Dosyaların fiziksel olarak sunucudan da silinmesini sağlayan akıllı çöp kutusu yönetimi.

\* \*\*Modern Modal UX:\*\* Ekrandan taşmaları önleyen, arka planı karartılmış tam merkezli şık açılır pencereler (Modal).



\## 🛠 Kullanılan Teknolojiler



\*\*Ön Yüz (Frontend)\*\*

\* HTML5 \& CSS3 (Modern ve Responsive Tasarım, CSS Grid/Flexbox)

\* Vanilla JavaScript (ES6+, Async/Await, Fetch API, FormData)



\*\*Arka Plan (Backend)\*\*

\* Python 3

\* FastAPI (Hızlı ve modern API altyapısı)

\* SQLAlchemy (ORM - Object Relational Mapping)



\*\*Veritabanı \& Sunucu (Database \& DevOps)\*\*

\* PostgreSQL

\* Docker \& Docker Compose (İzole ve kalıcı veritabanı yönetimi)



\---



\## 🚀 Kurulum ve Çalıştırma (Sıfırdan Başlangıç)



Projeyi kendi bilgisayarınızda çalıştırmak için aşağıdaki adımları sırasıyla izleyin.



\### 1. Gereksinimler

\* Bilgisayarınızda \*\*Python\*\* kurulu olmalıdır.

\* Bilgisayarınızda \*\*Docker Desktop\*\* kurulu ve çalışır durumda olmalıdır.



\### 2. Veritabanını Ayağa Kaldırma (Docker)

Öncelikle veritabanımızı başlatmalıyız.

1\. Proje klasöründeki `arka\_plan` (veya `backend`) dizinine girin.

2\. Bu klasörde bir terminal (CMD) açın.

3\. Aşağıdaki komutu çalıştırarak PostgreSQL veritabanını oluşturun:

&#x20;  ```bash

&#x20;  docker-compose up -d



\### 3. Arka Planı (API) Çalıştırma

1. Yine arka\_plan klasörü içindeki terminalde şu komutla gerekli Python eklentilerini kurun:

&#x20;  ```bash

&#x20;  pip install fastapi uvicorn sqlalchemy psycopg2-binary python-multipart



2\. Kurulum bittikten sonra API sunucumuzu başlatın:

&#x20;  ```bash

&#x20;  uvicorn main:app --reload



\### 4. Ön Yüzü Çalıştırma

1. Ana proje klasöründeki index.html dosyasını VS Code vb. bir editör ile açın.

2\. Live Server eklentisi ile (veya dosyaya çift tıklayarak) tarayıcıda çalıştırın.

3\. Çıkan ekranda yeni bir hesap oluşturup sistemi kullanmaya başlayabilirsiniz!



StudyMate/

│

├── index.html          # Uygulama ana ekranı ve Modal yapıları

├── style.css           # Modern UX/UI tasarımları ve Grid sistemleri

├── script.js           # Frontend mantığı, Fetch API istekleri ve DOM manipülasyonu

│

└── arka\_plan/          # Backend (FastAPI \& Veritabanı) Dosyaları

&#x20;   ├── main.py         # API Rotaları (CRUD işlemleri, Dosya okuma/yazma, Auth)

&#x20;   ├── database.py     # PostgreSQL bağlantısı ve Tablo şemaları

&#x20;   ├── docker-compose.yml # Veritabanı kurulum reçetesi

&#x20;   └── yuklenen\_dosyalar/ # Kullanıcıların yüklediği resim ve PDF'lerin fiziksel deposu























