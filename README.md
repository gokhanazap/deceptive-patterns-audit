# deceptive-patterns-audit

Web sitelerini ve kullanıcı akışlarını deceptive pattern (dark pattern, aldatıcı tasarım) açısından tarayan bir [Claude Code](https://claude.com/claude-code) skill'i. Türkçe çalışır ve Türkçe rapor yazar.

A Claude Code skill that audits live websites and flows for deceptive design patterns. Instructions and reports are in Turkish.

## Ne yapar

- Canlı siteyi ziyaretçi gözüyle gezer. Giriş yapmaz, form göndermez, satın almaz, bot korumasını aşmaz.
- Önce gözlem defteri tutar, sonra hüküm verir. Böylece "istediğin zaman iptal" ile sözleşme maddesi gibi adımlar arası çelişkileri yakalar.
- Her sayfada ölçüm betiği çalıştırır: önceden işaretli kutular, kabul ve ret düğmelerinin boyut ve kontrast farkı, küçük puntolu koşullar, sayaçlar, kapalı alanlar.
- Bulguları Aldatıcı, Baskı, Gri ya da Hata olarak ayırır; kasıt iddia etmez, hukuki hüküm yazmaz.
- Doğruluğu dışarıdan bilinemeyen şeyleri (sayaç, kıtlık, "en çok tercih edilen") suçlamaz, "iç veriyle doğrulanmalı" listesine koyar.
- Hangi akışın görülüp hangisinin görülemediğini kapsam tablosuyla söyler. Görülemeyen akış "sorun yok" sayılmaz.

Bu bir ön taramadır. Kullanıcı testinin ve hukuk görüşünün yerini tutmaz.

## Kurulum

```bash
git clone https://github.com/gokhanazap/deceptive-patterns-audit.git ~/.claude/skills/deceptive-patterns-audit
```

Sonra Claude Code'a şunu yazman yeterli: `örnek.com sitesini dark pattern açısından tara`.

Ürüne özel akış listesi eklemek için `references/urunler/<ürün>.md` oluştur. Tarama raporlarını açık repo'lara koyma.

## Benzerleriyle karşılaştırma

Kurgusal bir abonelik sitesi (`evals/ornekflix.html`) içine 15 kalıp ve 7 dürüst tuzak yerleştirildi. Üç skill, birbirinden habersiz ayrı ajanlarda ve aynı model ile çalıştırıldı, sonuçlar `evals/cevap-anahtari.md` ile puanlandı (Kasım 2026).

| | Bu skill | [Uxcel ux-dark-patterns-audit](https://github.com/Uxcel-Lab/product-skills/blob/HEAD/ux/audits/dark-patterns/SKILL.md) | [sidkh dark-pattern-audit](https://github.com/sidkh/skills/tree/HEAD/dark-pattern-audit) |
|---|---|---|---|
| Yakalanan kalıp | 15/15 | 15/15 | 15/15 |
| Yanlış alarm | 0 | 0 | 0 |
| Doğrulanacaklar ayrı liste | Evet | Hayır | Hayır |
| Kapsam tablosu | Evet | Hayır | Kısmen (özet) |
| Düzeltme önerisi | Evet | Evet | Bilerek yok |
| Temiz bulunanlar | Evet | Evet | Hayır |
| Canlı site gezme | Evet | Yönerge yok | Bilerek yok, yalnız kod |
| Ölçüm betiği | Evet | Hayır | Hayır |

Dürüst okuma: **tek dosyalık, kodu okunabilir bir sayfada yakalama açısından fark yok.** Testi bu skill'in yazarı kurdu ve sayfa kolay; üç skill de güçlü bir modelle çalıştı. Fark, kanıtın nasıl raporlandığında ve canlı sitede ortaya çıkar. Hangi kaynak ne için iyi:

- Kaynak kodun varsa sidkh iyi bir tercih: satır numarasıyla kanıt verir.
- Tasarım eleştirisi ve İngilizce rapor için Uxcel iyi bir tercih.
- Canlı site, Türkçe rapor ve dışarıdan bilinemeyeni ayırmak için bu skill.

## Dayandığı kaynaklar

- Maria Rosala, [Deceptive Patterns in UX](https://www.nngroup.com/articles/deceptive-patterns/), NN/g, 2023: beş kategori ve yürüyüş soruları, kendi ifademizle özetlendi.
- Sun, Vekaria, Nithyanand, [On the Suitability of LLM-Driven Agents for Dark Pattern Audits](https://arxiv.org/abs/2603.03881), PoPETs 2026: gözlem ile yargıyı ayırma, kapalı alanları açma, adımlar arası kayıt tutma, insan incelemesi.
- [deceptive.design](https://www.deceptive.design/types): kalıp adları.
- Uxcel skill'i (MIT): sınıflandırma ve karar testi fikirleri.

## Lisans

MIT
