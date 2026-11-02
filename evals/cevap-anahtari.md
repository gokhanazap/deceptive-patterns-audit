# Cevap anahtarı: ornekflix.html

## Olması gereken bulgular (15)
A1 Çerez: kabul 1 tık, ret 3 ekran + 214 ortak (engelleme/sludge) ve görsel eşitsizlik (kabul büyük, "Tercihleri yönet" 11px soluk)
A2 Uygulama popup'ı: yalnızca "Şimdi değil", kapatınca 60 sn sonra geri geliyor (nagging)
A3 Temel paket: "49 TL / ay" büyük, 3 ay sonra 249 TL otomatik tahsilat "Detaylar" içinde küçük soluk metinde (gizli yenileme / fiyat)
A4 Çelişki: hero "İstediğin zaman iptal et" vs sözleşme madde 14 / detay 12 ay taahhüt + cayma bedeli (adımlar arası)
A5 Sahte sosyal kanıt: "Şu an N kişi izliyor" Math.random
A6 Sahte aciliyet: sayaç sıfırlanınca başa dönüyor
A7 Karşılaştırmayı engelleme: Premium haftalık fiyat, diğerleri aylık/yıllık (62 TL/hafta)
A8 Zorla eylem / gizlilik: deneme için rehber izni ve adına davet mesajı
A9 Sepete gizlice ekleme: Cihaz Koruma Paketi önceden işaretli
A10 Önceden işaretli pazarlama izni: iş ortakları SMS
A11 Çift olumsuz + işaretli: "başlatmamayı istemediğimi"
A12 Gizli maliyet: Hizmet bedeli 29 TL yalnız son adımda (88 TL -> 117 TL)
A13 Confirmshaming: "Hayır, paramı boşa harcamayı seviyorum"
A14 Zor iptal: abonelik birkaç tık web, iptal yalnız telefon mesai saati / dilekçe
A15 Dipnotta sözleşme maddesi: cayma bedeli küçük soluk (A4 ile birlikte sayılabilir; ayrı ya da birleşik kabul)

## Dürüst tuzaklar: aldatıcı denmemeli (7)
T1 Standart yıllık: üstü çizili 1.908 = 12x159 doğru, %17 doğru (1590/1908=0.833)
T2 "En çok tercih edilen" rozeti: doğrulanamaz. "İç veriyle doğrulanmalı" ya da gri kabul, doğrulanmış aldatma diye yazılırsa hata
T3 Konser "Kalan koltuk: 12": sunucudan gerçek envanter, 400 kapasite. Sahte kıtlık denirse hata; "doğrulanmalı" kabul
T4 Bülten "Hayır, teşekkürler": nötr, 90 gün saygı duyuyor
T5 Pazarlama e-posta kutusu işaretsiz, sade metin
T6 3D Secure: makul güvenlik adımı, engelleme değil
T7 Profil onay simgesi: kullanılabilirlik hatası, deceptive pattern değil (ayrı "hata" olarak not edilirse doğru)

## Puanlama
- Yakalama: her A için 1 / kısmi 0.5 / 0. A4+A15 birleşikse ikisi de sayılır.
- Yanlış alarm: T bir aldatıcı bulgu olarak yazıldıysa -1.
- Kalite: her bulguda birebir alıntı ve konum var mı (e/h); doğrulanamayanları ayırmış mı; intent iddiası veya hukuk hükmü var mı; öneri var mı.
