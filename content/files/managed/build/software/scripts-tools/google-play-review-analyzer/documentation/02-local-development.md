# Google Play Review Analyzer — Local development

## Local development

Run these commands from the project repository. Commands listed here were inspected, not executed as part of writing this page.

~~~sh
python -m unittest
python new_app.py com.example.app --name example
python pipeline.py --app example --limit 50
~~~

## Project notes

Create a Python environment and install requirements.txt before running the pipeline; install Ollama and the configured model separately. Build the dashboard from web/ with npm install and npm run build. App profiles and generated review data can contain internal names or personal data and are not copied into Zero. The example commands make requests and require the local model; they were not executed for this documentation.

## Documentation sources

Prepared from the local repository README, package manifests, and the listed source folders on 13 November 2026.

- [Source repository](https://github.com/Stephenpaul-03/Google-Play-Review-Analyzer)
- [README at the inspected revision](https://github.com/Stephenpaul-03/Google-Play-Review-Analyzer/blob/0989fe0c7833229375eb79adec05b52ae7e51a7c/README.md)
