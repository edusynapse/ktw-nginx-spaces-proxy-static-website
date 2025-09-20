'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"version.json": "ae95d02578cdb7f75a61c3c8f6fd9021",
"index.html": "95c5776e6c1a6e9dc9b43fdb72b1aa4e",
"/": "95c5776e6c1a6e9dc9b43fdb72b1aa4e",
"main.dart.wasm": "bf3f5eaf2635d781546fbede16acb0e0",
"icons/Icon-maskable-512.png": "b20c965748ea3c72311c33a56548d204",
"icons/Icon-maskable-192.png": "71963dd5c02648065a0fa2d4f40bc186",
"icons/loader.gif": "0359424297c8c9cd37fcf1aee5487b84",
"icons/Icon-512.png": "b20c965748ea3c72311c33a56548d204",
"icons/Icon-192.png": "71963dd5c02648065a0fa2d4f40bc186",
"sw-offline.js": "d43a2353e5e6c63e9f4381eea1a5d658",
"main.dart.mjs": "12dec45c0ab86242fcb20cefdcd1a593",
"canvaskit/skwasm.js.symbols": "0088242d10d7e7d6d2649d1fe1bda7c1",
"canvaskit/skwasm_heavy.js.symbols": "3c01ec03b5de6d62c34e17014d1decd3",
"canvaskit/skwasm.js": "1ef3ea3a0fec4569e5d531da25f34095",
"canvaskit/canvaskit.js.symbols": "58832fbed59e00d2190aa295c4d70360",
"canvaskit/skwasm.wasm": "264db41426307cfc7fa44b95a7772109",
"canvaskit/canvaskit.js": "140ccb7d34d0a55065fbd422b843add6",
"canvaskit/skwasm_heavy.wasm": "8034ad26ba2485dab2fd49bdd786837b",
"canvaskit/canvaskit.wasm": "07b9f5853202304d3b0749d9306573cc",
"canvaskit/skwasm_heavy.js": "413f5b2b2d9345f37de148e2544f584f",
"canvaskit/chromium/canvaskit.js.symbols": "193deaca1a1424049326d4a91ad1d88d",
"canvaskit/chromium/canvaskit.js": "5e27aae346eee469027c80af0751d53d",
"canvaskit/chromium/canvaskit.wasm": "24c77e750a7fa6d474198905249ff506",
"main.dart.wasm.map": "1f55b37a88cfab833924445fcc5b6974",
"assets/FontManifest.json": "ed0b0d6186ff480d1012a80aa93fac92",
"assets/AssetManifest.bin": "dbf3b2157c5aa76a54f981377d5f58de",
"assets/packages/flutter_inappwebview_web/assets/web/web_support.js": "509ae636cfdd93e49b5a6eaf0f06d79f",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "33b7d9392238c04c131b6ce224e13711",
"assets/packages/syncfusion_flutter_pdfviewer/assets/icons/dark/underline.png": "59886133294dd6587b0beeac054b2ca3",
"assets/packages/syncfusion_flutter_pdfviewer/assets/icons/dark/squiggly.png": "68960bf4e16479abb83841e54e1ae6f4",
"assets/packages/syncfusion_flutter_pdfviewer/assets/icons/dark/strikethrough.png": "72e2d23b4cdd8a9e5e9cadadf0f05a3f",
"assets/packages/syncfusion_flutter_pdfviewer/assets/icons/dark/highlight.png": "2aecc31aaa39ad43c978f209962a985c",
"assets/packages/syncfusion_flutter_pdfviewer/assets/icons/light/underline.png": "a98ff6a28215341f764f96d627a5d0f5",
"assets/packages/syncfusion_flutter_pdfviewer/assets/icons/light/squiggly.png": "9894ce549037670d25d2c786036b810b",
"assets/packages/syncfusion_flutter_pdfviewer/assets/icons/light/strikethrough.png": "26f6729eee851adb4b598e3470e73983",
"assets/packages/syncfusion_flutter_pdfviewer/assets/icons/light/highlight.png": "2fbda47037f7c99871891ca5e57e030b",
"assets/packages/syncfusion_flutter_pdfviewer/assets/fonts/RobotoMono-Regular.ttf": "5b04fdfec4c8c36e8ca574e40b7148bb",
"assets/packages/fluttertoast/assets/toastify.js": "56e2c9cedd97f10e7e5f1cebd85d53e3",
"assets/packages/fluttertoast/assets/toastify.css": "a85675050054f179444bc5ad70ffc635",
"assets/packages/font_awesome_flutter/lib/fonts/Font%2520Awesome%25207%2520Free-Regular-400.otf": "5b48924b1767e9663c68d491103a5549",
"assets/packages/font_awesome_flutter/lib/fonts/Font%2520Awesome%25207%2520Free-Solid-900.otf": "7d69baa226d9609e4c95b6fec1242e87",
"assets/packages/font_awesome_flutter/lib/fonts/Font%2520Awesome%25207%2520Brands-Regular-400.otf": "28aa6d35e115380fc319802748419701",
"assets/packages/flutter_inappwebview/assets/t_rex_runner/t-rex.css": "5a8d0222407e388155d7d1395a75d5b9",
"assets/packages/flutter_inappwebview/assets/t_rex_runner/t-rex.html": "16911fcc170c8af1c5457940bd0bf055",
"assets/packages/flutter_soloud/web/worker.dart.js": "2fddc14058b5cc9ad8ba3a15749f9aef",
"assets/packages/flutter_soloud/web/libflutter_soloud_plugin.wasm": "cc369a6499c45bc7b647326179b31fa5",
"assets/packages/flutter_soloud/web/init_module.dart.js": "ea0b343660fd4dace81cfdc2910d14e6",
"assets/packages/flutter_soloud/web/libflutter_soloud_plugin.js": "fda499f4cf7725c740cf53d28b8970e5",
"assets/packages/flutter_app_minimizer_plus/assets/icon.png": "cc2ed5e91abb1b15cbf09a665f3385f5",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"assets/fonts/MaterialIcons-Regular.otf": "f6834fe624408beac26a9fa0dc43db97",
"assets/assets/sleeping.webp": "f87710b44cb8634dc3a4d4b25c75e159",
"assets/assets/profile_placeholder.webp": "30d64dd30991fc4bb234154b47b2ef25",
"assets/assets/splash.webp": "94a748d035df6deb19161299a567be7d",
"assets/assets/background.png": "385efe673a9d1d71130ebe4099bfc5ec",
"assets/assets/animation_back_1.jpg": "7ba02b991a8dfdc742e336895bfc452d",
"assets/assets/lang/TA.json.gz": "b5a28b8be79c74c51867c91e037c11bb",
"assets/assets/lang/ID.json.gz": "dd3dc9655d629e582ac10f8f88e506b3",
"assets/assets/lang/IG.json.gz": "fc2e35c1792260760a9607b7fa34add2",
"assets/assets/lang/HA.json.gz": "324197437357ef2ff2549b538ba2789d",
"assets/assets/lang/GU.json.gz": "1a5745f73b217bd37c05b71374d64841",
"assets/assets/lang/BN.json.gz": "6663754838b709a04bab648e5ac81344",
"assets/assets/lang/TW.json.gz": "6698b1185e1f5e78726008d80f3f8f7f",
"assets/assets/lang/AM.json.gz": "400defbbbe76994bbcc580644378cf41",
"assets/assets/lang/ES.json.gz": "b26ff4834d7758a765444021b13a076f",
"assets/assets/lang/MR.json.gz": "7a751e6b60bd0008b6e847241dabd95f",
"assets/assets/lang/FR.json.gz": "7c30cc7bea24a802381958fc3c4f112e",
"assets/assets/lang/HI.json.gz": "b408bdf95ad7f7f2c1a340e0030eb83a",
"assets/assets/lang/OR.json.gz": "093af2d10819c7f0420f179b0ce79075",
"assets/assets/lang/ZU.json.gz": "d67e5abe481d22beaeafd1117948a43a",
"assets/assets/lang/PT.json.gz": "c8fbca91dfc7c4ebd3ae6b58e92755f4",
"assets/assets/lang/TE.json.gz": "665b89e6c3e9eab47a0a6174ed4de56a",
"assets/assets/lang/TH.json.gz": "16efc6ccd6c6be77a21c0b877be11f7e",
"assets/assets/lang/KN.json.gz": "45226a1417338541f9d512e70b5cdf97",
"assets/assets/lang/SW.json.gz": "3c2605372400ec3d807abaa916088e0b",
"assets/assets/lang/EN.json.gz": "17d9e631209095a57efe010e7e7e9438",
"assets/assets/lang/YO.json.gz": "f2be45bd294066f5ba2103a0a45c3a9f",
"assets/assets/lang/TL.json.gz": "7d9c3dfb71d27978798ab22250a8ca41",
"assets/assets/lang/SN.json.gz": "0924a668c9a98d7ac7684f7b8e6d290b",
"assets/assets/lang/CN.json.gz": "3b8769916f33c3e6f71ee5f457d50e29",
"assets/assets/lang/VI.json.gz": "a844e1c658b26d74d733b80fa05a2eb1",
"assets/assets/card_back.webp": "ad2cf369a8624e9f1a548eb663a635cf",
"assets/assets/svg/applications_background.svg": "c9728dfb0e0300e9cc36a01300a70816",
"assets/assets/svg/account_background.svg": "c7e327a1a0134011fe1e062e57449517",
"assets/assets/svg/prizes_background.svg": "be377b5c1c3387c8bbdec28084f5b753",
"assets/assets/svg/stats_background.svg": "70020ba066b6aa8f318432cb5725dbbf",
"assets/assets/svg/verification_background.svg": "c17f86fdfd3c433902742fb05f099bac",
"assets/assets/svg/credits_background.svg": "4ab88e2a10b78d4a02902740db6a29ff",
"assets/assets/svg/activity_logs_background.svg": "07f8f16858b5b3d56c9231e2adc814bc",
"assets/assets/svg/referrals_background.svg": "08e954ac62be3b65e05ff79a61f700e6",
"assets/assets/svg/leaderboard_background.svg": "1d2949f822a239b28884532b889b8ba1",
"assets/assets/svg/jobs_background.svg": "c7e327a1a0134011fe1e062e57449517",
"assets/assets/svg/milestones_background.svg": "e2c2218e6aed574c228595e493ca37f6",
"assets/assets/svg/games_background.svg": "8a96ecfd425f6332e91bc74af516aeef",
"assets/assets/svg/profile_background.svg": "4ab88e2a10b78d4a02902740db6a29ff",
"assets/assets/svg/performance_background.svg": "1d2949f822a239b28884532b889b8ba1",
"assets/assets/login.png": "f6c8317f01a5e1d7e0167f2724462648",
"assets/assets/refresh.webp": "5a42a27078c29e789c11255881270bf4",
"assets/assets/logo.png": "a0b8b0bafe87f7e73a2ff8d8d2a5aa34",
"assets/assets/exit.webp": "05e8f27890147d3ea155619036d70564",
"assets/assets/theme/dark/svg/applications_background.svg": "61f472393049e99beb3edfd3f94f1692",
"assets/assets/theme/dark/svg/account_background.svg": "056b410c34afdb377b7770736c04b223",
"assets/assets/theme/dark/svg/prizes_background.svg": "75a6e4e6258ec90651947cb3f3ba25b0",
"assets/assets/theme/dark/svg/pageBackgroundTile.webp": "b134f2221abbe5d5c9d43121f99d426b",
"assets/assets/theme/dark/svg/background.webp": "c03c52706bd2f0bcad850a00ed08e52b",
"assets/assets/theme/dark/svg/stats_background.svg": "58455d2131d5a67515076eb833f5e36f",
"assets/assets/theme/dark/svg/verification_background.svg": "ea3ed9d4ea8bcb3092d47cef382ed5f7",
"assets/assets/theme/dark/svg/forgot.webp": "6b2b8f9e7089f5b72346fdb680a11a95",
"assets/assets/theme/dark/svg/appbarBackground.png": "e45419bd1a12b324df9033b68aa34ac6",
"assets/assets/theme/dark/svg/popupBackgroundImageTile.webp": "7ed14ab46fa008aa3e0368c3d8b9bddb",
"assets/assets/theme/dark/svg/credits_background.svg": "c5065ec515159bc62ab57866ee11e939",
"assets/assets/theme/dark/svg/session_shared.webp": "9e96dd160bb64486f1cf80067e840932",
"assets/assets/theme/dark/svg/cardBackgroundTile.webp": "2e897fb313a8516ad75fb102dae73b99",
"assets/assets/theme/dark/svg/activity_logs_background.svg": "f2adf2f06ef991061177fc7785869390",
"assets/assets/theme/dark/svg/referrals_background.svg": "0b8ce8d81e1194d81cab04aac734e71a",
"assets/assets/theme/dark/svg/filterSectionBackgroundTile.webp": "a83b012162b605fe6a6d34e56fcf54bb",
"assets/assets/theme/dark/svg/leaderboard_background.svg": "86c97c4a1d342a367cd2a48a5a376dd4",
"assets/assets/theme/dark/svg/jobs_background.svg": "3915b316a8b8349189e6d13e484f34d7",
"assets/assets/theme/dark/svg/milestones_background.svg": "e6ce8e7602ff34664ad9926f0b5961c5",
"assets/assets/theme/dark/svg/wizard.svg": "077de673a280cf82e542009fb6befc9a",
"assets/assets/theme/dark/svg/games_background.svg": "f55902a9af694f6a819ef6dfa29cdef4",
"assets/assets/theme/dark/svg/session_safe.webp": "c8daef178a6f29517b3f09646a5ab28e",
"assets/assets/theme/dark/svg/profile_background.svg": "c5065ec515159bc62ab57866ee11e939",
"assets/assets/theme/dark/svg/cardBackgroundTile.svg": "ba951891fc24c64e289439518483ae01",
"assets/assets/theme/dark/svg/performance_background.svg": "643b8d110243ae58c1e6e03263878dc2",
"assets/assets/theme/dark/svg/session_personal.webp": "241c56152d8256e74ea4d3d337395883",
"assets/assets/theme/dark/colors.json": "a911f2a0cf6d9ca33c353494f4f6607f",
"assets/assets/theme/children/svg/applications_background.svg": "c9728dfb0e0300e9cc36a01300a70816",
"assets/assets/theme/children/svg/account_background.svg": "c7e327a1a0134011fe1e062e57449517",
"assets/assets/theme/children/svg/prizes_background.svg": "be377b5c1c3387c8bbdec28084f5b753",
"assets/assets/theme/children/svg/pageBackgroundTile.webp": "2b8394cb8a33dff4b1ab534f27d771f3",
"assets/assets/theme/children/svg/background.webp": "13582a5c4d741d7a3ea1361b61eb9c40",
"assets/assets/theme/children/svg/stats_background.svg": "70020ba066b6aa8f318432cb5725dbbf",
"assets/assets/theme/children/svg/verification_background.svg": "c17f86fdfd3c433902742fb05f099bac",
"assets/assets/theme/children/svg/forgot.webp": "fec2e0b8f8abbb721d18393f48b56f9e",
"assets/assets/theme/children/svg/appbarBackground.png": "7d6a616c9cad01dbf79d0d0c33f0f522",
"assets/assets/theme/children/svg/popupBackgroundImageTile.webp": "68ee23f0aa805f13ee123b567d5d4b5f",
"assets/assets/theme/children/svg/credits_background.svg": "4ab88e2a10b78d4a02902740db6a29ff",
"assets/assets/theme/children/svg/session_shared.webp": "fabd5b7adf69a1acf322ee0673fc24eb",
"assets/assets/theme/children/svg/cardBackgroundTile.webp": "8c2b3c482c5ac4b7a4f749e1a3fe599a",
"assets/assets/theme/children/svg/activity_logs_background.svg": "07f8f16858b5b3d56c9231e2adc814bc",
"assets/assets/theme/children/svg/referrals_background.svg": "08e954ac62be3b65e05ff79a61f700e6",
"assets/assets/theme/children/svg/filterSectionBackgroundTile.webp": "5672222cf7e5f0a7e619ca54670db6f1",
"assets/assets/theme/children/svg/leaderboard_background.svg": "1d2949f822a239b28884532b889b8ba1",
"assets/assets/theme/children/svg/jobs_background.svg": "c7e327a1a0134011fe1e062e57449517",
"assets/assets/theme/children/svg/milestones_background.svg": "e2c2218e6aed574c228595e493ca37f6",
"assets/assets/theme/children/svg/wizard.svg": "82b8a783b104b6c6c6ad70bbbd1395ab",
"assets/assets/theme/children/svg/games_background.svg": "8a96ecfd425f6332e91bc74af516aeef",
"assets/assets/theme/children/svg/filterSectionBackgroundTile.svg": "69671dcd33fca3b2a402f27ea490da09",
"assets/assets/theme/children/svg/session_safe.webp": "cda89d66d20c9cf0cc15b63247b812b5",
"assets/assets/theme/children/svg/profile_background.svg": "4ab88e2a10b78d4a02902740db6a29ff",
"assets/assets/theme/children/svg/cardBackgroundTile.svg": "0f05eb1cf3e32e9f1ed1d8147ae72306",
"assets/assets/theme/children/svg/performance_background.svg": "1d2949f822a239b28884532b889b8ba1",
"assets/assets/theme/children/svg/session_personal.webp": "3153335deacc580fec10cbb70f78c62f",
"assets/assets/theme/children/colors.json": "230d4aecb25bc08017472c7d8737870e",
"assets/assets/theme/default/svg/applications_background.svg": "0a99a40b534205ca56c824236d91f261",
"assets/assets/theme/default/svg/account_background.svg": "70ffef3821df779a8341c10582f3d461",
"assets/assets/theme/default/svg/prizes_background.svg": "bc525feeb5dbf78ad000f0ef93a6ed29",
"assets/assets/theme/default/svg/pageBackgroundTile.webp": "ea1b92329dcfb43a3c6bf7163961607d",
"assets/assets/theme/default/svg/background.webp": "0fda1d74ae3baa675f098b723f774964",
"assets/assets/theme/default/svg/stats_background.svg": "d2c2a480ff773ee1a9d1417e13b58259",
"assets/assets/theme/default/svg/verification_background.svg": "c17f86fdfd3c433902742fb05f099bac",
"assets/assets/theme/default/svg/forgot.webp": "357f9a32766092a83e81627c6987e652",
"assets/assets/theme/default/svg/appbarBackground.png": "3176a9177aec8d89c0bb6cbe7a36d7bd",
"assets/assets/theme/default/svg/popupBackgroundImageTile.webp": "68ee23f0aa805f13ee123b567d5d4b5f",
"assets/assets/theme/default/svg/credits_background.svg": "f591984f233722c619886b3e22b73288",
"assets/assets/theme/default/svg/session_shared.webp": "e6bb397e67f899c71a6f323a33c09d86",
"assets/assets/theme/default/svg/cardBackgroundTile.webp": "81eacec9beb136ac5d8e4efda49df340",
"assets/assets/theme/default/svg/activity_logs_background.svg": "5a35e45fa7a71140277afa069cfd1a04",
"assets/assets/theme/default/svg/referrals_background.svg": "f3a659c4a1830f3dce45ee66eab131d2",
"assets/assets/theme/default/svg/filterSectionBackgroundTile.webp": "c386b21f684bb59f1e030033f9891a09",
"assets/assets/theme/default/svg/leaderboard_background.svg": "13bdc1750eeb02de8de7d786d9dd28f8",
"assets/assets/theme/default/svg/jobs_background.svg": "d4b30b71df9b54da7036a0a36468c5fd",
"assets/assets/theme/default/svg/milestones_background.svg": "dc6e245845567e62590720b4138b0238",
"assets/assets/theme/default/svg/wizard.svg": "82b8a783b104b6c6c6ad70bbbd1395ab",
"assets/assets/theme/default/svg/games_background.svg": "775d1d0daf7137370ca6c2fb13cfbbb2",
"assets/assets/theme/default/svg/session_safe.webp": "cde171deabc006e827c02f4ea3e2b8d2",
"assets/assets/theme/default/svg/profile_background.svg": "f591984f233722c619886b3e22b73288",
"assets/assets/theme/default/svg/performance_background.svg": "13bdc1750eeb02de8de7d786d9dd28f8",
"assets/assets/theme/default/svg/session_personal.webp": "b265a31e60e9da7b320cc4275440bbf7",
"assets/assets/theme/default/colors.json": "ece70b829921fe93a7183e7f2b229be3",
"assets/assets/language.webp": "4234dc9439b633b347d077fcf0ec8e58",
"assets/AssetManifest.json": "1093ae9292784af5fca8efd513304555",
"assets/NOTICES": "0c17989704bf57911bee42ae9a855864",
"assets/AssetManifest.bin.json": "21c08e5a317f218cc20761f18ca841e1",
"assets/adminassets/background.webp": "685bcf3be411f9e5b94c3bac4a52f2b1",
"assets/adminassets/splash_admin.webp": "8fb02a702999847aae30a0b4698f3f31",
"assets/adminassets/logo.png": "6fc7f11f2ad066ff12c53d259c55a6ba",
"flutter.js": "888483df48293866f9f41d3d9274a779",
"manifest.json": "ad1f9acbb4f601660b1c29f5ae5be812",
"favicon.png": "45908c991643429360051e27056437fb",
"main.dart.js": "a249a05094f1e63b5a36ed3c5f88c71d",
".well-known/assetlinks.json": "be5305802791a9670b3e0b6e3d931b94",
"workers/language_service.web.g.dart.js.deps": "303273b635181071f02ee82e09e319f8",
"workers/cache_service_worker.mjs": "84193e71a9e2cd236ec5e47b9ad83a1b",
"workers/cache_service_worker.unopt.wasm": "cc1073a1facead10f8b47c2358e44e17",
"workers/decompress_service.web.g.dart.wasm.map": "6e6cc839dbf3f018212a6e19138c5d0f",
"workers/timeduri_service.web.g.dart.unopt.wasm.map": "2e9cbb6ce2a7f101a0863f5f0a2bdb78",
"workers/timeduri_service.web.g.dart.support.js": "59002d908a5278d086a3399af5b91cbe",
"workers/decompress_service.web.g.dart.support.js": "59002d908a5278d086a3399af5b91cbe",
"workers/timeduri_service.web.g.dart.js": "a9d4546e503f55358a1affeae79c24c2",
"workers/language_service.web.g.dart.unopt.wasm": "f518fddeb59578edf92cb43cd43e7897",
"workers/language_service.web.g.dart.mjs": "733d868227eb0760fb413e34b646ca03",
"workers/cache_service_worker.support.js": "59002d908a5278d086a3399af5b91cbe",
"workers/session_service.web.g.dart.js.deps": "ea247a38bcb87059cd45d4b171ae8b51",
"workers/cache_service_worker.unopt.wasm.map": "eb55613b491b6f5a20723c5414fcc5b1",
"workers/cache_service_worker.js.deps": "f287a6a2256a4eaf41bd3e061ebdc933",
"workers/timeduri_service.web.g.dart.wasm.map": "a436af2bb77d77752b114039d6819d62",
"workers/session_service.web.g.dart.wasm": "e2181c91f736ced52e7eab7d0e957a19",
"workers/cache_service_worker.wasm": "763968a6f7c87bf9eb361bd251226186",
"workers/timeduri_service.web.g.dart.js.map": "36cd6ed2a43b0ff58ef160786214a61e",
"workers/language_service.web.g.dart.wasm": "34b466bc9b0c0a225c9d8874cc3ecbfd",
"workers/decompress_service.web.g.dart.js": "dad9431653a4839400d167cb84115f2e",
"workers/language_service.web.g.dart.wasm.map": "32b10370c01c186745f7ee168830f9b3",
"workers/language_service.web.g.dart.js": "131905ee3b6ca5188b3fd176fec68fe1",
"workers/session_service.web.g.dart.unopt.wasm": "6ab0ac34d56a85f6398cc342f2f18597",
"workers/cache_service.web.g.dart.wasm": "238e3a9596c3cd875305d98ea9665481",
"workers/cache_service.web.g.dart.js": "feb86208c1653f10f34a6eebf5a323a8",
"workers/cache_service.web.g.dart.js.map": "24037df6af575c8aa18bc2742f29a18b",
"workers/cache_service.web.g.dart.js.deps": "c626be6a66611ee75dcb3fe09786ca00",
"workers/decompress_service.web.g.dart.wasm": "d99adcb9316a3f48b78d2d7d86a531a1",
"workers/timeduri_service.web.g.dart.wasm": "b68afd01b590974c0bc7c2808f73549b",
"workers/cache_service_worker.js.map": "fa4b68fa899d74ed3368a37e9aa19753",
"workers/language_service.web.g.dart.support.js": "59002d908a5278d086a3399af5b91cbe",
"workers/language_service.web.g.dart.unopt.wasm.map": "06206d7fd81faaebf76a7d5bf0f14e60",
"workers/timeduri_service.web.g.dart.unopt.wasm": "96e97070a1371471285c2e27a05e6698",
"workers/session_service.web.g.dart.mjs": "2b69bd575708cfb4982115ba587ce0f2",
"workers/decompress_service.web.g.dart.js.map": "ac5b78ea4e2adb930e128880f179b06e",
"workers/cache_service.web.g.dart.mjs": "0c150c186c28d74626fc1258ad28b645",
"workers/cache_service_worker.js": "5ef3bcd4b16ee6e95c794b474747e9b6",
"workers/cache_service.web.g.dart.unopt.wasm.map": "7db46a1de6de3577e2fa8948d330d5a3",
"workers/decompress_service.web.g.dart.unopt.wasm": "0f01cf9143796741882d28c785a6241c",
"workers/cache_service.web.g.dart.unopt.wasm": "db00eb2e4a5868c17bb2875462f94edb",
"workers/decompress_service.web.g.dart.js.deps": "42ed57312deb2d51b8af09b00b92e540",
"workers/session_service.web.g.dart.unopt.wasm.map": "27ef01d1414cf8e0a714356b2eb29222",
"workers/decompress_service.web.g.dart.unopt.wasm.map": "3365aa7c44a01a31f2831101279a13e4",
"workers/timeduri_service.web.g.dart.js.deps": "f1b71ef772dfa3cd8b93d1ea28da7b0c",
"workers/cache_service.web.g.dart.wasm.map": "2141834c47eb1fd1601fcfa73cf24f6d",
"workers/cache_service.web.g.dart.support.js": "59002d908a5278d086a3399af5b91cbe",
"workers/decompress_service.web.g.dart.mjs": "859ca6fa84e60a20659aea229ba41cd7",
"workers/session_service.web.g.dart.js": "435e8f1c178c4657ead92543ccc2fd9c",
"workers/session_service.web.g.dart.support.js": "59002d908a5278d086a3399af5b91cbe",
"workers/timeduri_service.web.g.dart.mjs": "fba28d2e64228cb93f05a2f994136140",
"workers/session_service.web.g.dart.wasm.map": "c885f96bbdb4e03da4ad69c236e3bae9",
"workers/session_service.web.g.dart.js.map": "7927f88d68c4a9e131aaf61900cd1bdc",
"workers/language_service.web.g.dart.js.map": "fcd115828bea27bfc469190f972bbbc3",
"workers/cache_service_worker.wasm.map": "9fa3ce045f089a798e28c1ff2bf210dd",
"index_Non_WASM.html": "f58aa103694319ccfd0971c60e4e088a",
"firebase-messaging-sw.js": "f534489e125b753c097a473b012efd7a",
"flutter_bootstrap.js": "14aaf723ffea54baf55011a1f7d1e86e"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"main.dart.wasm",
"main.dart.mjs",
"index.html",
"flutter_bootstrap.js",
"assets/AssetManifest.bin.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
