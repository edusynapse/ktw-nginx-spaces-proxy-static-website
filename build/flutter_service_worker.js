'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"version.json": "c32e2d5c1703664755a3330ac042e6fa",
"index.html": "e08520bdfb5eb8c088d33773dafb6449",
"/": "e08520bdfb5eb8c088d33773dafb6449",
"main.dart.wasm": "880bf2a4b630fd858100755872b8dbcd",
"icons/Icon-maskable-512.png": "b20c965748ea3c72311c33a56548d204",
"icons/Icon-maskable-192.png": "71963dd5c02648065a0fa2d4f40bc186",
"icons/loader.gif": "0359424297c8c9cd37fcf1aee5487b84",
"icons/Icon-512.png": "b20c965748ea3c72311c33a56548d204",
"icons/Icon-192.png": "71963dd5c02648065a0fa2d4f40bc186",
"sw-offline.js": "d43a2353e5e6c63e9f4381eea1a5d658",
"main.dart.mjs": "f2645b0df9d75b8054e3f70b43ccf71e",
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
"main.dart.wasm.map": "f945f1b36e8149a4249d97a1b7adb9ba",
"assets/FontManifest.json": "ed0b0d6186ff480d1012a80aa93fac92",
"assets/AssetManifest.bin": "0bff3bd2ab96106c5f3a7bfe7b625036",
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
"assets/packages/font_awesome_flutter/lib/fonts/Font%2520Awesome%25207%2520Free-Solid-900.otf": "5fa5596eb8b79666791942d4a4102e82",
"assets/packages/font_awesome_flutter/lib/fonts/Font%2520Awesome%25207%2520Brands-Regular-400.otf": "28aa6d35e115380fc319802748419701",
"assets/packages/flutter_inappwebview/assets/t_rex_runner/t-rex.css": "5a8d0222407e388155d7d1395a75d5b9",
"assets/packages/flutter_inappwebview/assets/t_rex_runner/t-rex.html": "16911fcc170c8af1c5457940bd0bf055",
"assets/packages/flutter_soloud/web/worker.dart.js": "2fddc14058b5cc9ad8ba3a15749f9aef",
"assets/packages/flutter_soloud/web/libflutter_soloud_plugin.wasm": "cc369a6499c45bc7b647326179b31fa5",
"assets/packages/flutter_soloud/web/init_module.dart.js": "ea0b343660fd4dace81cfdc2910d14e6",
"assets/packages/flutter_soloud/web/libflutter_soloud_plugin.js": "fda499f4cf7725c740cf53d28b8970e5",
"assets/packages/flutter_app_minimizer_plus/assets/icon.png": "cc2ed5e91abb1b15cbf09a665f3385f5",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"assets/fonts/MaterialIcons-Regular.otf": "a808aff0296e13a68df0c48ae54b7df3",
"assets/assets/sleeping.webp": "f87710b44cb8634dc3a4d4b25c75e159",
"assets/assets/profile_placeholder.webp": "30d64dd30991fc4bb234154b47b2ef25",
"assets/assets/session_shared.webp": "7ba697133a1ff092e68cb7d201e81573",
"assets/assets/animation_back_1.jpg": "7ba02b991a8dfdc742e336895bfc452d",
"assets/assets/lang/TA.json.gz": "e19b1c0b5460016ac7a07e8bbbc1d342",
"assets/assets/lang/ID.json.gz": "9ac20760de4c91c838e7b44ba5806c40",
"assets/assets/lang/IG.json.gz": "d5d7bc45812290204b51a1e1c556dc6b",
"assets/assets/lang/HA.json.gz": "eb4af765a128995c1a626f59b1c9d56d",
"assets/assets/lang/GU.json.gz": "c2cdcca3c3f3914b1e528580d104cee8",
"assets/assets/lang/BN.json.gz": "0bd600f50392cc8e3b2dd2f2963ee7c8",
"assets/assets/lang/TW.json.gz": "f62a00e4e7354353edd73c549afc3931",
"assets/assets/lang/AM.json.gz": "1746c572499ec97ebe534b9d71c459af",
"assets/assets/lang/ES.json.gz": "8e9055f39e26afdb14cea5ba36ce2785",
"assets/assets/lang/MR.json.gz": "ff0dfedc66b34d312570dc8d1a712a0a",
"assets/assets/lang/FR.json.gz": "30fc7b45b0246c0aeb731136c32a8fa3",
"assets/assets/lang/HI.json.gz": "713fcbb19749abb010bdd356eadf10f1",
"assets/assets/lang/OR.json.gz": "829011d592dcb71dd5a16c25eea98a55",
"assets/assets/lang/ZU.json.gz": "df0f7e8f1a1f800b7f39d084661bfebd",
"assets/assets/lang/PT.json.gz": "c39efa82a72a445a21aa28d70f7014b6",
"assets/assets/lang/TE.json.gz": "d75f55c65c047fbd176bc00faa3654e9",
"assets/assets/lang/TH.json.gz": "5f931f5ee7641c1ae874efd90a726f17",
"assets/assets/lang/KN.json.gz": "92c1780236a2f27099ae8718bdd71325",
"assets/assets/lang/SW.json.gz": "fd4d217ace9560e1f76cd014ea99481e",
"assets/assets/lang/EN.json.gz": "88571fd0e4045cf72b1b76b6e2ed39dd",
"assets/assets/lang/YO.json.gz": "ec5f1c2b0f49e50dfcef43ceb2a22a4d",
"assets/assets/lang/TL.json.gz": "3f6aa9b320fe7b5b8c11ed8a6ece937f",
"assets/assets/lang/SN.json.gz": "ce8523661fc9f578f0abe7299c398b31",
"assets/assets/lang/CN.json.gz": "3fbea66d2f295de71935d82e450d5c19",
"assets/assets/lang/VI.json.gz": "f9fcc8d9aef599349fc22b40f8d8e735",
"assets/assets/turnstile_error.webp": "5340e4044706c3a3aa871e747da3e8e4",
"assets/assets/logo.png": "a0b8b0bafe87f7e73a2ff8d8d2a5aa34",
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
"assets/assets/theme/dark/colors.json": "b52400683af52204f4177d14f47a9971",
"assets/assets/theme/children/svg/applications_background.svg": "c9728dfb0e0300e9cc36a01300a70816",
"assets/assets/theme/children/svg/account_background.svg": "c7e327a1a0134011fe1e062e57449517",
"assets/assets/theme/children/svg/prizes_background.svg": "be377b5c1c3387c8bbdec28084f5b753",
"assets/assets/theme/children/svg/pageBackgroundTile.webp": "2b8394cb8a33dff4b1ab534f27d771f3",
"assets/assets/theme/children/svg/background.webp": "e78cc7ecbfb4008c11f23067b8e8bb5c",
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
"assets/AssetManifest.json": "b0acda9b1f3eaa671325d99014730b82",
"assets/NOTICES": "e6c2d249576c44d310aa983bc7cbc672",
"assets/AssetManifest.bin.json": "e97d24c53bcd456a5a456fd1b5b26f32",
"assets/adminassets/background.webp": "685bcf3be411f9e5b94c3bac4a52f2b1",
"assets/adminassets/splash_admin.webp": "8fb02a702999847aae30a0b4698f3f31",
"assets/adminassets/logo.png": "6fc7f11f2ad066ff12c53d259c55a6ba",
"flutter.js": "888483df48293866f9f41d3d9274a779",
"manifest.json": "ad1f9acbb4f601660b1c29f5ae5be812",
"favicon.png": "45908c991643429360051e27056437fb",
"main.dart.js": "fce9539c96461da1dc075928e92cc068",
".well-known/assetlinks.json": "be5305802791a9670b3e0b6e3d931b94",
"workers/language_service.web.g.dart.js.deps": "1f4887cd92622fd3b37717ba4ca11ab6",
"workers/cache_service_worker.mjs": "84193e71a9e2cd236ec5e47b9ad83a1b",
"workers/cache_service_worker.unopt.wasm": "cc1073a1facead10f8b47c2358e44e17",
"workers/decompress_service.web.g.dart.wasm.map": "edabc2352f760fbd81e2227ee1d4da79",
"workers/timeduri_service.web.g.dart.unopt.wasm.map": "72768654829b72739e38b6df42a7810d",
"workers/usb_auth_service.web.g.dart.js": "055ff6fa4f012ba91cb44ba8b3ac00d5",
"workers/timeduri_service.web.g.dart.support.js": "59002d908a5278d086a3399af5b91cbe",
"workers/decompress_service.web.g.dart.support.js": "59002d908a5278d086a3399af5b91cbe",
"workers/timeduri_service.web.g.dart.js": "d7f5d9f98bf579802ad5f6fe97908740",
"workers/usb_auth_service.web.g.dart.js.map": "757ce6879e34432e23af63625e7e12d3",
"workers/usb_auth_service.web.g.dart.wasm": "fff3d82e2cea3ed93ca4b26c299c9852",
"workers/language_service.web.g.dart.unopt.wasm": "f8f298864fc52eac7972950e64e82ab3",
"workers/language_service.web.g.dart.mjs": "b3e21b565db09420e13a79527c2aae73",
"workers/cache_service_worker.support.js": "59002d908a5278d086a3399af5b91cbe",
"workers/session_service.web.g.dart.js.deps": "bbfd2edceb7567971846f3479334bc73",
"workers/cache_service_worker.unopt.wasm.map": "eb55613b491b6f5a20723c5414fcc5b1",
"workers/cache_service_worker.js.deps": "f287a6a2256a4eaf41bd3e061ebdc933",
"workers/timeduri_service.web.g.dart.wasm.map": "43c6eeada7b0b81d77a9984f82e82b6e",
"workers/usb_auth_service.web.g.dart.support.js": "59002d908a5278d086a3399af5b91cbe",
"workers/session_service.web.g.dart.wasm": "499e81a27af4437361928baf20399da9",
"workers/usb_auth_service.web.g.dart.unopt.wasm.map": "5bf404f24cb65519a4d3f30615c54022",
"workers/cache_service_worker.wasm": "763968a6f7c87bf9eb361bd251226186",
"workers/image_resize_service.web.g.dart.unopt.wasm.map": "a0e18f0e914a2e1a581b0f346e455763",
"workers/timeduri_service.web.g.dart.js.map": "e8ac3bc7e07b7547f55b7e64d13c1f44",
"workers/language_service.web.g.dart.wasm": "160047379529cfe585685ce2d3b62251",
"workers/decompress_service.web.g.dart.js": "827005cf0825fa75b9ea4c636a7f0290",
"workers/image_resize_service.web.g.dart.support.js": "59002d908a5278d086a3399af5b91cbe",
"workers/language_service.web.g.dart.wasm.map": "b040fbb7704dc5da382fe88c24e309c7",
"workers/language_service.web.g.dart.js": "81018d74256e0b01bd7029f1ef4d41da",
"workers/session_service.web.g.dart.unopt.wasm": "35d291f6cc3debc2b70eace5a2fdcc0b",
"workers/cache_service.web.g.dart.wasm": "5b6f7efce79c70793a1aeef5eae8f9e6",
"workers/usb_auth_service.web.g.dart.unopt.wasm": "3142b1369368ab38b9a7b8949af73d59",
"workers/cache_service.web.g.dart.js": "06c76ce14a9f6bc4b050d2b49c8839d8",
"workers/cache_service.web.g.dart.js.map": "20b096d46c39a996e218f045ee220b00",
"workers/cache_service.web.g.dart.js.deps": "c626be6a66611ee75dcb3fe09786ca00",
"workers/image_resize_service.web.g.dart.js.map": "a9bebbe2481dad0962b97ff6da8fe787",
"workers/usb_auth_service.web.g.dart.js.deps": "a830b3bf8b66e86d6e020c7686b00e70",
"workers/decompress_service.web.g.dart.wasm": "af750ae39f2154101cc4a73f513d8bc5",
"workers/timeduri_service.web.g.dart.wasm": "ce52b31cd0e391da19113974b16083cd",
"workers/cache_service_worker.js.map": "fa4b68fa899d74ed3368a37e9aa19753",
"workers/language_service.web.g.dart.support.js": "59002d908a5278d086a3399af5b91cbe",
"workers/language_service.web.g.dart.unopt.wasm.map": "f1ff67edd6c6f074702bdd1d72c35e8a",
"workers/timeduri_service.web.g.dart.unopt.wasm": "86b49fb41ec9f172e71366fce8cb54da",
"workers/session_service.web.g.dart.mjs": "20e71da041bc3040eb67f7502cb654fd",
"workers/image_resize_service.web.g.dart.wasm.map": "bccd33554cf03c777ba1963b9caaadee",
"workers/decompress_service.web.g.dart.js.map": "98afbfc6caeae013170f2da7732abcac",
"workers/cache_service.web.g.dart.mjs": "0c150c186c28d74626fc1258ad28b645",
"workers/usb_auth_service.web.g.dart.mjs": "cd7aa7fc79c886f6ad39425f838389e3",
"workers/cache_service_worker.js": "5ef3bcd4b16ee6e95c794b474747e9b6",
"workers/cache_service.web.g.dart.unopt.wasm.map": "7010a358689dba070693506e3ff30835",
"workers/decompress_service.web.g.dart.unopt.wasm": "097fad18b7e1f36484ae257577b35530",
"workers/cache_service.web.g.dart.unopt.wasm": "1ed783b3e276db12c5b1cab728401d78",
"workers/decompress_service.web.g.dart.js.deps": "cf7a9d9ee0acb6ac65951f7331964be0",
"workers/session_service.web.g.dart.unopt.wasm.map": "c4daf54430458ab3a61d66a2c2fe35cc",
"workers/decompress_service.web.g.dart.unopt.wasm.map": "5caaad19612b12577143beada1b32aa8",
"workers/image_resize_service.web.g.dart.wasm": "a3f45996025140a93a0a1856586b45a3",
"workers/timeduri_service.web.g.dart.js.deps": "8ede0d52d0e53b2af5b69db8214fc6c4",
"workers/cache_service.web.g.dart.wasm.map": "3a41cd4bcb62160b626e8745fc7851e1",
"workers/cache_service.web.g.dart.support.js": "59002d908a5278d086a3399af5b91cbe",
"workers/decompress_service.web.g.dart.mjs": "6c1dd882a8830bde6c053c1fd17096c2",
"workers/session_service.web.g.dart.js": "451d90c05200c7e2035465ba1a9b77e9",
"workers/session_service.web.g.dart.support.js": "59002d908a5278d086a3399af5b91cbe",
"workers/image_resize_service.web.g.dart.mjs": "8640fd315875f55b599a5d38bce968eb",
"workers/timeduri_service.web.g.dart.mjs": "fba28d2e64228cb93f05a2f994136140",
"workers/session_service.web.g.dart.wasm.map": "be48d4deef254d9e0a316e07b7c6dcd1",
"workers/session_service.web.g.dart.js.map": "6033e40a7f12058c31a94274a075bd50",
"workers/image_resize_service.web.g.dart.js.deps": "480c6308c902b02113107b72b74cd71a",
"workers/image_resize_service.web.g.dart.unopt.wasm": "bb038f882b03d97c86e2e3fe773b5919",
"workers/image_resize_service.web.g.dart.js": "7be73dbd982d2a7dc32ab04c20a256c1",
"workers/usb_auth_service.web.g.dart.wasm.map": "46c79066bb4569eec2daedee0e953e55",
"workers/language_service.web.g.dart.js.map": "e328c2a11cfeb5c198253e259ab7013e",
"workers/cache_service_worker.wasm.map": "9fa3ce045f089a798e28c1ff2bf210dd",
"index_Non_WASM.html": "f58aa103694319ccfd0971c60e4e088a",
"firebase-messaging-sw.js": "f534489e125b753c097a473b012efd7a",
"sw-kill.js": "e0d25956bcf615ef35814a69335041f4",
"flutter_bootstrap.js": "340431b3d0f8e7260cccf825c87f4b9f"};
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
