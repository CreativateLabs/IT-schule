# CodePath

Interaktive Coding-Schule als statische Webseite. Führt Lernende in 6 Phasen von null zum Profi: Fundament, Python, Web, Backend, Security, Profi-Level.

## Features

- 26 Lektionen in 6 Phasen mit Quiz und Code-Übungen
- XP-System und Fortschrittsanzeige
- **Profil-System**: Mehrere Profile pro Browser, jedes mit eigenem Fortschritt
- **Export/Import**: Fortschritt als JSON-Datei sichern und übertragen
- Lucide-Icons statt Emojis
- Responsive Design
- Keine Build-Tools, reines HTML/CSS/JS

## Entwicklung

```bash
npm install
npm run dev       # Dev-Server auf http://localhost:8080
npm test          # Playwright-Tests
npm run validate  # HTML validieren
```

## Deploy

Die Seite ist GitHub-Pages-kompatibel. Einfach den Branch auf GitHub Pages verbinden — `index.html` liegt im Root.

## Datenspeicherung

Alle Profile und Fortschrittsdaten werden im `localStorage` des Browsers gespeichert. Kein Backend, keine Tracker. Über den Export-Button kannst du dein Profil jederzeit als JSON sichern.
