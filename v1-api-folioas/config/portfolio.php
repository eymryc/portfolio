<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Upload disk (public = stockage local, s3 = AWS)
    |--------------------------------------------------------------------------
    */
    'upload_disk' => env('PORTFOLIO_UPLOAD_DISK', 'public'),

    'upload_max_kb' => (int) env('PORTFOLIO_UPLOAD_MAX_KB', 5120),

    /*
    |--------------------------------------------------------------------------
    | CV extraction — LLM (type LinkedIn / parseurs intelligents)
    |--------------------------------------------------------------------------
    | Si OPENAI_API_KEY est défini, l'extraction utilise OpenAI pour parser
    | le texte du CV (meilleure précision, formats variés). Sinon : règles.
    */
    'cv_use_llm'    => (bool) env('CV_USE_LLM', true),
    'openai_api_key' => env('OPENAI_API_KEY'),
    'openai_model'   => env('OPENAI_CV_MODEL', 'gpt-4o-mini'),

];
