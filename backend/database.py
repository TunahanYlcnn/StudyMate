from sqlalchemy import create_engine, Column, Integer, String, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# 1. VERİTABANI BAĞLANTI ADRESİ
# Bu bilgileri docker-compose.yml dosyamızdan alıyoruz.
# Şifre: gizli_sifre_123, Kullanıcı: studymate_admin, Veritabanı Adı: studymate_veritabani
SQLALCHEMY_DATABASE_URL = "postgresql://studymate_admin:gizli_sifre_123@localhost:5432/studymate_veritabani"

# 2. MOTOR (İletişim Aracı)
# Python ile PostgreSQL arasındaki köprüyü kurar
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# 3. OTURUM (Session)
# Veritabanına her kayıt eklediğimizde veya veri çektiğimizde açılan kapı
OturumLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 4. TABLO ŞABLONU
Base = declarative_base()

# ==========================================
# GÖREVLER TABLOSUNUN TASARIMI
# ==========================================
class Gorev(Base):
    __tablename__ = "gorevler" # Veritabanında bu isimle bir tablo açılacak

    id = Column(Integer, primary_key=True, index=True)
    baslik = Column(String, index=True)
    aciklama = Column(String)
    tarih = Column(String)
    gunNo = Column(Integer)
    ayNo = Column(Integer)
    yilNo = Column(Integer)
    durum = Column(Boolean, default=False)
    
    # YENİ EKLENEN KISIM: RESİM VE PDF İÇİN ADRES SÜTUNLARI
    dosya_adresi = Column(String, nullable=True) # Dosyanın bilgisayardaki adresi (Boş bırakılabilir)
    dosya_tipi = Column(String, nullable=True)   # "resim" veya "pdf" yazacak (Boş bırakılabilir)