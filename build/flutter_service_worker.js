'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"version.json": "feb9a70e09d1a9e91a123d2d51784044",
"index.html": "abda4e6e87dd35ca934f8db3e40dd5f6",
"/": "abda4e6e87dd35ca934f8db3e40dd5f6",
"main.dart.wasm": "a8d85159282928d37052ff8a1bf0fb98",
"robots.txt": "f71d20196d4caf35b6a670db8c70b03d",
"icons/Icon-maskable-512.png": "b20c965748ea3c72311c33a56548d204",
"icons/Icon-maskable-192.png": "71963dd5c02648065a0fa2d4f40bc186",
"icons/loader.gif": "d237155c1216c8a968ea4f43835c1d88",
"icons/Icon-512.png": "b20c965748ea3c72311c33a56548d204",
"icons/Icon-192.png": "71963dd5c02648065a0fa2d4f40bc186",
"sw-offline.js": "d43a2353e5e6c63e9f4381eea1a5d658",
"learn/index.html": "20490f15f1983b184d0fdea8cb479c92",
"main.dart.mjs": "d52fcb5e37876b6000113daa5bb4a2b4",
"canvaskit/skwasm.js.symbols": "3a4aadf4e8141f284bd524976b1d6bdc",
"canvaskit/skwasm_heavy.js.symbols": "0755b4fb399918388d71b59ad390b055",
"canvaskit/skwasm.js": "8060d46e9a4901ca9991edd3a26be4f0",
"canvaskit/canvaskit.js.symbols": "a3c9f77715b642d0437d9c275caba91e",
"canvaskit/skwasm.wasm": "7e5f3afdd3b0747a1fd4517cea239898",
"canvaskit/canvaskit.js": "8331fe38e66b3a898c4f37648aaf7ee2",
"canvaskit/skwasm_heavy.wasm": "b0be7910760d205ea4e011458df6ee01",
"canvaskit/canvaskit.wasm": "9b6a7830bf26959b200594729d73538e",
"canvaskit/skwasm_heavy.js": "740d43a6b8240ef9e23eed8c48840da4",
"canvaskit/chromium/canvaskit.js.symbols": "e2d09f0e434bc118bf67dae526737d07",
"canvaskit/chromium/canvaskit.js": "a80c765aaa8af8645c9fb1aae53f9abf",
"canvaskit/chromium/canvaskit.wasm": "a726e3f75a84fcdf495a15817c63a35d",
"assets/FontManifest.json": "07da357f1f636a449900bde6f7de338a",
"assets/AssetManifest.bin": "c8d75031a3f2ae4135dec8f13346af66",
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
"assets/packages/font_awesome_flutter/lib/fonts/Font-Awesome-7-Brands-Regular-400.otf": "35614ddd4a0928b40f90c14fc564d3bb",
"assets/packages/font_awesome_flutter/lib/fonts/Font-Awesome-7-Free-Regular-400.otf": "d4131f9ec5b52aecf8a5c3f5713568f6",
"assets/packages/font_awesome_flutter/lib/fonts/Font-Awesome-7-Free-Solid-900.otf": "31ee388ef4139e78c87c8921c2858505",
"assets/packages/flutter_inappwebview/assets/t_rex_runner/t-rex.css": "5a8d0222407e388155d7d1395a75d5b9",
"assets/packages/flutter_inappwebview/assets/t_rex_runner/t-rex.html": "16911fcc170c8af1c5457940bd0bf055",
"assets/packages/flutter_soloud/web/worker.dart.js": "2fddc14058b5cc9ad8ba3a15749f9aef",
"assets/packages/flutter_soloud/web/libflutter_soloud_plugin.wasm": "48de38c371b32af62cc0a725549f3e6d",
"assets/packages/flutter_soloud/web/init_module.dart.js": "ea0b343660fd4dace81cfdc2910d14e6",
"assets/packages/flutter_soloud/web/libflutter_soloud_plugin.js": "f5c5f12150613886a9c3010969cfa8f6",
"assets/packages/flutter_app_minimizer_plus/assets/icon.png": "cc2ed5e91abb1b15cbf09a665f3385f5",
"assets/shaders/stretch_effect.frag": "40d68efbbf360632f614c731219e95f0",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"assets/fonts/MaterialIcons-Regular.otf": "137bf3514dd2b1af8e31a2175e350ce4",
"assets/assets/sleeping.webp": "b97d6c5c7bbd21ecb5c8e6c834618633",
"assets/assets/profile_placeholder.webp": "30d64dd30991fc4bb234154b47b2ef25",
"assets/assets/session_shared.webp": "7ba697133a1ff092e68cb7d201e81573",
"assets/assets/animation_back_1.jpg": "7ba02b991a8dfdc742e336895bfc452d",
"assets/assets/lang/TA.json.gz": "da527499901ad6284fac17100b658979",
"assets/assets/lang/ID.json.gz": "713b0b815ccb9d2c386b49745a1df140",
"assets/assets/lang/IG.json.gz": "18dfb9560fdeeeb7612f750311253543",
"assets/assets/lang/HA.json.gz": "afcabc368ec4e753375901fade03a0f7",
"assets/assets/lang/GU.json.gz": "cba8e2bc6af8015d51c39967aabb126f",
"assets/assets/lang/BN.json.gz": "018966d760a5d50d106fcf87e96f22e6",
"assets/assets/lang/TW.json.gz": "3053a2f17a1aa586e4d9ef76e583dcbf",
"assets/assets/lang/AM.json.gz": "b5f2257083e957e61519d7d0b6adf0fa",
"assets/assets/lang/ES.json.gz": "0311eb5ce7257220fc9f86c2b9ab7b65",
"assets/assets/lang/MR.json.gz": "bad496ee691357e074d7c624b77d8715",
"assets/assets/lang/FR.json.gz": "cf01c3a8d2eeb0136898bee2a9633824",
"assets/assets/lang/HI.json.gz": "d2549f7fd77059ead71f857adef24b85",
"assets/assets/lang/OR.json.gz": "b31caed5768b4af435dddac937620531",
"assets/assets/lang/ZU.json.gz": "9ccaec3fad046e961e314bf080132358",
"assets/assets/lang/PT.json.gz": "663dbdfd2a3fcff5d20c6a1cf19b7dd2",
"assets/assets/lang/TE.json.gz": "b378b1f1582f5f967a013d44ca13fb13",
"assets/assets/lang/TH.json.gz": "e3e8ba103fb84be38c0af118cd127f2d",
"assets/assets/lang/KN.json.gz": "2ae2f1e369434061f35c97caf6a7ee23",
"assets/assets/lang/SW.json.gz": "a067233f2fb67d03a239d50c220ddbc7",
"assets/assets/lang/EN.json.gz": "c1a02b2e035b200005a51ec6953d9a8c",
"assets/assets/lang/YO.json.gz": "a3da90f4ba728a5bf6e7e1622eea52fb",
"assets/assets/lang/TL.json.gz": "70da06e4da9166d515c2e1d8e9d68105",
"assets/assets/lang/SN.json.gz": "afcae912490a52aa5f6a696bb7dc8b55",
"assets/assets/lang/CN.json.gz": "3929003e1e092a005ed333ff2a75c5ce",
"assets/assets/lang/VI.json.gz": "3182f1fe477ba42c2028105e4d9ca1d5",
"assets/assets/turnstile_error.webp": "5340e4044706c3a3aa871e747da3e8e4",
"assets/assets/logo.png": "a0b8b0bafe87f7e73a2ff8d8d2a5aa34",
"assets/assets/awake.webp": "52751faf6ecb83e9856c510ae711aa2f",
"assets/assets/ship.webp": "8ecc6e98c4b918d640c0dd66b1edc7ed",
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
"assets/assets/theme/dark/svg/cardBackgroundTile.webp": "2e897fb313a8516ad75fb102dae73b99",
"assets/assets/theme/dark/svg/activity_logs_background.svg": "f2adf2f06ef991061177fc7785869390",
"assets/assets/theme/dark/svg/referrals_background.svg": "0b8ce8d81e1194d81cab04aac734e71a",
"assets/assets/theme/dark/svg/filterSectionBackgroundTile.webp": "a83b012162b605fe6a6d34e56fcf54bb",
"assets/assets/theme/dark/svg/leaderboard_background.svg": "86c97c4a1d342a367cd2a48a5a376dd4",
"assets/assets/theme/dark/svg/jobs_background.svg": "3915b316a8b8349189e6d13e484f34d7",
"assets/assets/theme/dark/svg/milestones_background.svg": "e6ce8e7602ff34664ad9926f0b5961c5",
"assets/assets/theme/dark/svg/wizard.svg": "077de673a280cf82e542009fb6befc9a",
"assets/assets/theme/dark/svg/games_background.svg": "f55902a9af694f6a819ef6dfa29cdef4",
"assets/assets/theme/dark/svg/profile_background.svg": "c5065ec515159bc62ab57866ee11e939",
"assets/assets/theme/dark/svg/cardBackgroundTile.svg": "ba951891fc24c64e289439518483ae01",
"assets/assets/theme/dark/svg/performance_background.svg": "643b8d110243ae58c1e6e03263878dc2",
"assets/assets/theme/dark/colors.json": "93b5e826b831d3f5a70167e8af020bbf",
"assets/assets/theme/children/svg/applications_background.svg": "c9728dfb0e0300e9cc36a01300a70816",
"assets/assets/theme/children/svg/account_background.svg": "c7e327a1a0134011fe1e062e57449517",
"assets/assets/theme/children/svg/prizes_background.svg": "be377b5c1c3387c8bbdec28084f5b753",
"assets/assets/theme/children/svg/pageBackgroundTile.webp": "2b8394cb8a33dff4b1ab534f27d771f3",
"assets/assets/theme/children/svg/background.webp": "db6aea5251ca13aeabac22cba57bd323",
"assets/assets/theme/children/svg/stats_background.svg": "70020ba066b6aa8f318432cb5725dbbf",
"assets/assets/theme/children/svg/verification_background.svg": "c17f86fdfd3c433902742fb05f099bac",
"assets/assets/theme/children/svg/forgot.webp": "fec2e0b8f8abbb721d18393f48b56f9e",
"assets/assets/theme/children/svg/appbarBackground.png": "7d6a616c9cad01dbf79d0d0c33f0f522",
"assets/assets/theme/children/svg/popupBackgroundImageTile.webp": "68ee23f0aa805f13ee123b567d5d4b5f",
"assets/assets/theme/children/svg/credits_background.svg": "4ab88e2a10b78d4a02902740db6a29ff",
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
"assets/assets/theme/children/svg/profile_background.svg": "4ab88e2a10b78d4a02902740db6a29ff",
"assets/assets/theme/children/svg/cardBackgroundTile.svg": "0f05eb1cf3e32e9f1ed1d8147ae72306",
"assets/assets/theme/children/svg/performance_background.svg": "1d2949f822a239b28884532b889b8ba1",
"assets/assets/theme/children/colors.json": "df22f9a726694521e6e70e157a88ab56",
"assets/assets/theme/default/svg/applications_background.svg": "0a99a40b534205ca56c824236d91f261",
"assets/assets/theme/default/svg/account_background.svg": "70ffef3821df779a8341c10582f3d461",
"assets/assets/theme/default/svg/prizes_background.svg": "bc525feeb5dbf78ad000f0ef93a6ed29",
"assets/assets/theme/default/svg/pageBackgroundTile.webp": "ea1b92329dcfb43a3c6bf7163961607d",
"assets/assets/theme/default/svg/background.webp": "38a76deb6869ecf2efa485ff16a73a27",
"assets/assets/theme/default/svg/stats_background.svg": "d2c2a480ff773ee1a9d1417e13b58259",
"assets/assets/theme/default/svg/verification_background.svg": "c17f86fdfd3c433902742fb05f099bac",
"assets/assets/theme/default/svg/forgot.webp": "357f9a32766092a83e81627c6987e652",
"assets/assets/theme/default/svg/appbarBackground.png": "3176a9177aec8d89c0bb6cbe7a36d7bd",
"assets/assets/theme/default/svg/popupBackgroundImageTile.webp": "68ee23f0aa805f13ee123b567d5d4b5f",
"assets/assets/theme/default/svg/credits_background.svg": "f591984f233722c619886b3e22b73288",
"assets/assets/theme/default/svg/cardBackgroundTile.webp": "81eacec9beb136ac5d8e4efda49df340",
"assets/assets/theme/default/svg/activity_logs_background.svg": "5a35e45fa7a71140277afa069cfd1a04",
"assets/assets/theme/default/svg/referrals_background.svg": "f3a659c4a1830f3dce45ee66eab131d2",
"assets/assets/theme/default/svg/filterSectionBackgroundTile.webp": "c386b21f684bb59f1e030033f9891a09",
"assets/assets/theme/default/svg/leaderboard_background.svg": "13bdc1750eeb02de8de7d786d9dd28f8",
"assets/assets/theme/default/svg/jobs_background.svg": "d4b30b71df9b54da7036a0a36468c5fd",
"assets/assets/theme/default/svg/milestones_background.svg": "dc6e245845567e62590720b4138b0238",
"assets/assets/theme/default/svg/wizard.svg": "82b8a783b104b6c6c6ad70bbbd1395ab",
"assets/assets/theme/default/svg/games_background.svg": "775d1d0daf7137370ca6c2fb13cfbbb2",
"assets/assets/theme/default/svg/profile_background.svg": "f591984f233722c619886b3e22b73288",
"assets/assets/theme/default/svg/performance_background.svg": "13bdc1750eeb02de8de7d786d9dd28f8",
"assets/assets/theme/default/colors.json": "491a2c4505064d18386f1ca61badddb9",
"assets/assets/session_safe.webp": "615255fd33af8452647b46e05910ecea",
"assets/assets/language.webp": "4234dc9439b633b347d077fcf0ec8e58",
"assets/assets/session_personal.webp": "b46a5d125f1fa1c298bb47da5d6d2127",
"assets/NOTICES": "dade5018750b7592ff794c7ef90e513e",
"assets/AssetManifest.bin.json": "1e0ce61a19cc6813fa0abebb9838618c",
"assets/adminassets/background.webp": "685bcf3be411f9e5b94c3bac4a52f2b1",
"assets/adminassets/splash_admin.webp": "8fb02a702999847aae30a0b4698f3f31",
"assets/adminassets/logo.png": "6fc7f11f2ad066ff12c53d259c55a6ba",
"flutter.js": "24bc71911b75b5f8135c949e27a2984e",
"humans.txt": "4e66db3e9e668aec788353e7b8f4855e",
"manifest.json": "ad1f9acbb4f601660b1c29f5ae5be812",
"favicon.png": "45908c991643429360051e27056437fb",
"main.dart.js": "9c476998998ace4f2c2eab9d4fc4936b",
".well-known/assetlinks.json": "8a2a23419ee522f36d2909fc5bd2e0e0",
"workers/language_service.web.g.dart.js.deps": "1f4887cd92622fd3b37717ba4ca11ab6",
"workers/cache_service_worker.mjs": "84193e71a9e2cd236ec5e47b9ad83a1b",
"workers/cache_service_worker.unopt.wasm": "cc1073a1facead10f8b47c2358e44e17",
"workers/decompress_service.web.g.dart.wasm.map": "ff37d9aa07bebba05b99d0a2762037d2",
"workers/timeduri_service.web.g.dart.unopt.wasm.map": "1276696d2928e2bc7bb265d52dfa8799",
"workers/usb_auth_service.web.g.dart.js": "055ff6fa4f012ba91cb44ba8b3ac00d5",
"workers/timeduri_service.web.g.dart.support.js": "59002d908a5278d086a3399af5b91cbe",
"workers/decompress_service.web.g.dart.support.js": "59002d908a5278d086a3399af5b91cbe",
"workers/timeduri_service.web.g.dart.js": "d7f5d9f98bf579802ad5f6fe97908740",
"workers/usb_auth_service.web.g.dart.js.map": "757ce6879e34432e23af63625e7e12d3",
"workers/usb_auth_service.web.g.dart.wasm": "60c27e48cb9cce645b130ca8e519ddbc",
"workers/language_service.web.g.dart.unopt.wasm": "2bfc1f60f067e202a4c7df41cfd0b07f",
"workers/language_service.web.g.dart.mjs": "1ac81526daf7fbb3422b68413e47bc38",
"workers/cache_service_worker.support.js": "59002d908a5278d086a3399af5b91cbe",
"workers/session_service.web.g.dart.js.deps": "bbfd2edceb7567971846f3479334bc73",
"workers/cache_service_worker.unopt.wasm.map": "eb55613b491b6f5a20723c5414fcc5b1",
"workers/cache_service_worker.js.deps": "f287a6a2256a4eaf41bd3e061ebdc933",
"workers/timeduri_service.web.g.dart.wasm.map": "b65583f398556e545ba5329bf129ab0e",
"workers/usb_auth_service.web.g.dart.support.js": "59002d908a5278d086a3399af5b91cbe",
"workers/session_service.web.g.dart.wasm": "8e95c3f78aeb256070070e4c9c4de069",
"workers/usb_auth_service.web.g.dart.unopt.wasm.map": "81beb4ed902079fd30d8636307cee291",
"workers/cache_service_worker.wasm": "763968a6f7c87bf9eb361bd251226186",
"workers/image_resize_service.web.g.dart.unopt.wasm.map": "4193355e6bf7e2e04f88a5bfc0e3e76a",
"workers/timeduri_service.web.g.dart.js.map": "e8ac3bc7e07b7547f55b7e64d13c1f44",
"workers/language_service.web.g.dart.wasm": "6a6edf57d7abc4a78a46bc47f41c5429",
"workers/decompress_service.web.g.dart.js": "827005cf0825fa75b9ea4c636a7f0290",
"workers/image_resize_service.web.g.dart.support.js": "59002d908a5278d086a3399af5b91cbe",
"workers/language_service.web.g.dart.wasm.map": "fda1c21f89ae635ba8db637edbb39a3d",
"workers/language_service.web.g.dart.js": "81018d74256e0b01bd7029f1ef4d41da",
"workers/session_service.web.g.dart.unopt.wasm": "23b6a3068478022eee765a8afeca0fa6",
"workers/cache_service.web.g.dart.wasm": "0924a2915153d78687f21fa88ab3f5cb",
"workers/usb_auth_service.web.g.dart.unopt.wasm": "1684860f3f9c161b55d72bc3911e3780",
"workers/cache_service.web.g.dart.js": "06c76ce14a9f6bc4b050d2b49c8839d8",
"workers/cache_service.web.g.dart.js.map": "20b096d46c39a996e218f045ee220b00",
"workers/cache_service.web.g.dart.js.deps": "c626be6a66611ee75dcb3fe09786ca00",
"workers/image_resize_service.web.g.dart.js.map": "a9bebbe2481dad0962b97ff6da8fe787",
"workers/usb_auth_service.web.g.dart.js.deps": "a830b3bf8b66e86d6e020c7686b00e70",
"workers/decompress_service.web.g.dart.wasm": "d32f7bc979ffebc1a37c65d71b0eaef7",
"workers/timeduri_service.web.g.dart.wasm": "e6e288637a4b5303a71560bea126362f",
"workers/cache_service_worker.js.map": "fa4b68fa899d74ed3368a37e9aa19753",
"workers/language_service.web.g.dart.support.js": "59002d908a5278d086a3399af5b91cbe",
"workers/language_service.web.g.dart.unopt.wasm.map": "aff02873eb5a02f3afb4f096bfb9e19d",
"workers/timeduri_service.web.g.dart.unopt.wasm": "7c6f6ae46a9be81038b2fd1081bfd983",
"workers/session_service.web.g.dart.mjs": "5dce8a181cecc5a8d3cc1e3d4d12a0c6",
"workers/image_resize_service.web.g.dart.wasm.map": "eada1f3663fe9d09abd8ef0b18b29229",
"workers/decompress_service.web.g.dart.js.map": "98afbfc6caeae013170f2da7732abcac",
"workers/cache_service.web.g.dart.mjs": "8af33cc3bbf48d33a3bfe8261d2da43c",
"workers/usb_auth_service.web.g.dart.mjs": "35a74e55f7e2e082a89cbccceb1d6d86",
"workers/cache_service_worker.js": "5ef3bcd4b16ee6e95c794b474747e9b6",
"workers/cache_service.web.g.dart.unopt.wasm.map": "2337c8e01c43322c1dfff66bcca24c0e",
"workers/decompress_service.web.g.dart.unopt.wasm": "060af52d8dcf4663e41c8d8a15ddc158",
"workers/cache_service.web.g.dart.unopt.wasm": "42acc0079971782d92b25eb44f00ddf1",
"workers/decompress_service.web.g.dart.js.deps": "cf7a9d9ee0acb6ac65951f7331964be0",
"workers/session_service.web.g.dart.unopt.wasm.map": "742181e7cf63371dea6fb39750d07ff0",
"workers/decompress_service.web.g.dart.unopt.wasm.map": "c522d575a831722cde9c14768308a6fc",
"workers/image_resize_service.web.g.dart.wasm": "45e477d9e0f067339500a4023e92cffe",
"workers/timeduri_service.web.g.dart.js.deps": "8ede0d52d0e53b2af5b69db8214fc6c4",
"workers/cache_service.web.g.dart.wasm.map": "f56cd22a21dcf67a93a43468067d5f5b",
"workers/cache_service.web.g.dart.support.js": "59002d908a5278d086a3399af5b91cbe",
"workers/decompress_service.web.g.dart.mjs": "3e19df86be443c294d4b54334342beb0",
"workers/session_service.web.g.dart.js": "451d90c05200c7e2035465ba1a9b77e9",
"workers/session_service.web.g.dart.support.js": "59002d908a5278d086a3399af5b91cbe",
"workers/image_resize_service.web.g.dart.mjs": "7d96da9d4a29d883cbfd845a1729a95d",
"workers/timeduri_service.web.g.dart.mjs": "abef11f0b4700ba39c5a0851f791e34c",
"workers/session_service.web.g.dart.wasm.map": "70833ae4c17ad4d92d3941a550004200",
"workers/session_service.web.g.dart.js.map": "6033e40a7f12058c31a94274a075bd50",
"workers/image_resize_service.web.g.dart.js.deps": "480c6308c902b02113107b72b74cd71a",
"workers/image_resize_service.web.g.dart.unopt.wasm": "48a4963a1a95c01fc832d98cef22bcbe",
"workers/image_resize_service.web.g.dart.js": "7be73dbd982d2a7dc32ab04c20a256c1",
"workers/usb_auth_service.web.g.dart.wasm.map": "fee4e1efc4ad1d51ce764775c56656ce",
"workers/language_service.web.g.dart.js.map": "e328c2a11cfeb5c198253e259ab7013e",
"workers/cache_service_worker.wasm.map": "9fa3ce045f089a798e28c1ff2bf210dd",
"sitemap.xml": "f96f6c0c073dfa117619c38f64deaff3",
"index_Non_WASM.html": "f58aa103694319ccfd0971c60e4e088a",
"firebase-messaging-sw.js": "f534489e125b753c097a473b012efd7a",
"sw-kill.js": "e0d25956bcf615ef35814a69335041f4",
"flutter_bootstrap.js": "b080ca02d2cc61e9060d2556e8480adb"};
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
