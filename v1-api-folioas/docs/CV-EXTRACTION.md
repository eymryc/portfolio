# Extraction de données depuis un CV (type LinkedIn / industrie)

Ce document décrit la logique d’extraction des CV utilisée dans l’API et comment l’aligner sur les pratiques des acteurs comme LinkedIn et les parseurs modernes.

## Pipeline type « LinkedIn / Affinda »

En général, un parseur de CV suit ces étapes :

1. **Lecture du document**  
   - PDF / Word / image → extraction du texte (OCR si image, librairie PDF si natif).  
   - Ici : `smalot/pdfparser` pour le PDF.

2. **Analyse de la structure (layout)**  
   - Repérer les titres de sections (Expérience, Formation, Compétences, etc.).  
   - Détecter les blocs (paragraphes, listes, tableaux) pour ne pas mélanger les zones.

3. **Extraction d’entités (NLP / règles)**  
   - **Profil** : nom, titre, courte bio (souvent en tête).  
   - **Contact** : email, téléphone (regex ou NER sur tout le texte).  
   - **Expériences** : pour chaque bloc, période, poste, entreprise, lieu, description.  
   - **Formation** : année(s), diplôme, établissement, lieu.  
   - **Compétences** : listes ou catégories (Langages, Outils, etc.).

4. **Normalisation**  
   - Mapper les champs extraits vers le schéma cible (portfolio : `profile`, `contact`, `experiences`, `education`, `skills`).  
   - Dates normalisées, champs requis renseignés ou marqués manquants.

## Bonnes pratiques (industrie 2024)

- **Schéma en avance** : définir le JSON attendu (profile, contact, experiences, education, skills) et faire produire uniquement ça.  
- **Ne pas inventer** : n’extraire que ce qui est écrit ; pas d’inférence de dates ou de postes manquants.  
- **Gestion des formats variés** : colonnes, tableaux, plusieurs langues → soit règles robustes, soit LLM.  
- **Qualité du texte** : OCR propre (résolution, contraste) améliore tout le reste.  
- **Option LLM** : pour CV très variés, un modèle (ex. GPT) avec prompt + sortie structurée donne de bons résultats et gère mieux le sens que les seules regex.

## Implémentation dans cette API

- **Sans LLM** : `CvExtractService` — règles (sections, regex dates, patterns email/tel, heuristiques nom/titre/lieu).  
- **Avec LLM (optionnel)** : `CvExtractLlmService` — si `OPENAI_API_KEY` est défini et `CV_USE_LLM=true`, le texte du CV est envoyé à OpenAI avec un prompt qui impose le même schéma ; la réponse JSON est mappée vers `profile`, `contact`, `experiences`, `education`, `skills`.  
- **Fallback** : si LLM non configuré, désactivé (`CV_USE_LLM=false`) ou en erreur, on utilise le parser par règles (`CvExtractService::parseCvText()`).

### Configuration LLM

| Variable d'environnement | Description |
|-------------------------|-------------|
| `OPENAI_API_KEY`        | Clé API OpenAI (obligatoire pour LLM). |
| `CV_USE_LLM`            | `true` (défaut) ou `false` pour forcer le parser par règles. |
| `OPENAI_CV_MODEL`       | Modèle utilisé, défaut : `gpt-4o-mini`. |

Fichiers : `config/portfolio.php`, `app/Services/CvExtractLlmService.php`, `app/Http/Controllers/Api/Me/CvExtractController.php`.

## Références

- [How does resume parsing work? (Affinda)](https://www.affinda.com/blog/how-does-resume-parsing-work)  
- [Resume Parsing in the Age of LLMs (Airparser)](https://airparser.com/blog/resume-parsing-in-the-age-of-llms/)  
- [OpenAI Structured Outputs](https://platform.openai.com/docs/guides/structured-outputs)  
- LinkedIn Talent Solutions (upload de CV) : flux signé + synchro profil ; le détail du parsing interne n’est pas public.
