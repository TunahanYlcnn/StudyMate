from sqlalchemy import create_engine, Column, Integer, String, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

SQLALCHEMY_DATABASE_URL = "postgresql://studymate_admin:gizli_sifre_123@veritabani:5432/studymate_veritabani"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
OturumLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# ==========================================
# YENİ: KULLANICILAR TABLOSU
# ==========================================
class Kullanici(Base):
    __tablename__ = "kullanicilar"

    id = Column(Integer, primary_key=True, index=True)
    kullanici_adi = Column(String, unique=True, index=True)
    eposta = Column(String, unique=True, index=True)
    sifre = Column(String) # Güvenlik için normalde şifrelenir ama başlangıç için düz metin tutuyoruz

# ==========================================
# GÖREVLER TABLOSU
# ==========================================
class Gorev(Base):
    __tablename__ = "gorevler"

    id = Column(Integer, primary_key=True, index=True)
    
    # YENİ: Bu görevin hangi kullanıcıya ait olduğunu tutan kimlik (ID) bağı
    kullanici_id = Column(Integer, index=True) 
    
    baslik = Column(String, index=True)
    aciklama = Column(String)
    tarih = Column(String)
    gunNo = Column(Integer)
    ayNo = Column(Integer)
    yilNo = Column(Integer)
    durum = Column(Boolean, default=False)
    
    dosya_adresi = Column(String, nullable=True) 
    dosya_tipi = Column(String, nullable=True)