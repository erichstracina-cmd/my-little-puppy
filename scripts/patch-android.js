/* Úpravy vygenerovaného Android projektu (spúšťa sa po `npx cap add android`).
   - verzia aplikácie z premenných prostredia (VERSION_CODE, VERSION_NAME)
   - podpisovanie vydania (KEYSTORE_PATH, KEYSTORE_PASSWORD, KEY_ALIAS, KEY_PASSWORD)
   - orientácia na výšku, farba pozadia okna, ikony a úvodná obrazovka z priečinka android-res */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const app = path.join(root, 'android', 'app');
if (!fs.existsSync(app)) { console.error('Chýba priečinok android/app. Najprv spusti: npx cap add android'); process.exit(1); }

function edit(file, fn) {
  const p = path.join(app, file);
  const before = fs.readFileSync(p, 'utf8');
  const after = fn(before);
  if (after === before && !before.includes('MOJPSIK')) throw new Error('Úprava sa neuplatnila: ' + file);
  fs.writeFileSync(p, after);
  console.log('upravené:', file);
}
function replaceOnce(src, a, b, label) {
  if (!src.includes(a)) throw new Error('Nenašiel som text pre úpravu: ' + label);
  return src.replace(a, b);
}

/* --- build.gradle: verzia + podpisovanie --- */
edit('build.gradle', (s) => {
  if (s.includes('MOJPSIK')) return s;
  s = replaceOnce(s, 'versionCode 1\n', 'versionCode (System.getenv("VERSION_CODE") ?: "1").toInteger() // MOJPSIK\n', 'versionCode');
  s = replaceOnce(s, 'versionName "1.0"', 'versionName (System.getenv("VERSION_NAME") ?: "1.0")', 'versionName');
  s = replaceOnce(s, '    buildTypes {\n        release {\n',
    '    signingConfigs {\n        release {\n            def ksPath = System.getenv("KEYSTORE_PATH")\n            if (ksPath) {\n                storeFile file(ksPath)\n                storePassword System.getenv("KEYSTORE_PASSWORD")\n                keyAlias System.getenv("KEY_ALIAS")\n                keyPassword System.getenv("KEY_PASSWORD")\n            }\n        }\n    }\n    buildTypes {\n        release {\n            if (System.getenv("KEYSTORE_PATH")) { signingConfig signingConfigs.release }\n', 'buildTypes');
  return s;
});

/* --- AndroidManifest: iba na výšku --- */
edit('src/main/AndroidManifest.xml', (s) => {
  if (s.includes('screenOrientation')) return s + '<!-- MOJPSIK -->';
  return replaceOnce(s, 'android:launchMode="singleTask"', 'android:launchMode="singleTask"\n            android:screenOrientation="portrait"', 'orientation');
});

/* --- farba pozadia okna (aby pri okrajoch nebola biela / čierna) --- */
const res = path.join(app, 'src', 'main', 'res');
fs.mkdirSync(path.join(res, 'values-night'), { recursive: true });
fs.writeFileSync(path.join(res, 'values', 'moj_colors.xml'), '<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="appBackground">#F2F0FF</color>\n</resources>\n');
fs.writeFileSync(path.join(res, 'values-night', 'moj_colors.xml'), '<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="appBackground">#14122B</color>\n</resources>\n');
edit('src/main/res/values/styles.xml', (s) => {
  if (s.includes('windowBackground')) return s + '<!-- MOJPSIK -->';
  return replaceOnce(s, '<item name="android:background">@null</item>', '<item name="android:background">@null</item>\n        <item name="android:windowBackground">@color/appBackground</item>', 'windowBackground');
});

/* --- ikony a úvodná obrazovka --- */
function copyDir(src, dst) {
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, e.name), d = path.join(dst, e.name);
    if (e.isDirectory()) { fs.mkdirSync(d, { recursive: true }); copyDir(s, d); } else { fs.copyFileSync(s, d); }
  }
}
const resSrc = path.join(root, 'android-res');
if (fs.existsSync(resSrc)) { copyDir(resSrc, res); console.log('skopírované: ikony a úvodná obrazovka'); }
console.log('Hotovo.');
