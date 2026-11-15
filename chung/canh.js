/*!
 * Cảnh địa danh Việt Nam cho banner các trang của cổng vietclass.cvcec.org.
 * Vẽ phẳng kiểu sách tranh; màu chỉ lấy từ biến --ttv-* của bộ mẫu (qua lớp CSS trong cong.css).
 * Dùng: <section class="trang-dau co-canh" data-canh="hoi-an">…</section> (cong.js tự chèn cảnh và nhãn).
 */
(function () {
  "use strict";

  function may(x, y, k) {
    k = k || 1;
    return '<g class="may" transform="translate(' + x + ' ' + y + ') scale(' + k + ')"><rect x="0" y="0" width="130" height="34" rx="17"/><circle cx="42" cy="2" r="26"/><circle cx="82" cy="8" r="19"/></g>';
  }
  function denLong(x, y, mau) {
    var khac = mau === "mai" ? "vang" : "mai";
    return '<g transform="translate(' + x + ' ' + y + ')"><path class="net-day" d="M0 -6 v8"/><ellipse class="' + mau + '" cx="0" cy="13" rx="10" ry="13"/><rect class="' + khac + '" x="-5" y="-1" width="10" height="4"/><rect class="' + khac + '" x="-5" y="24" width="10" height="4"/><path class="net-day" d="M0 28 v9"/></g>';
  }
  var TROI = '<rect class="troi" x="0" y="0" width="1200" height="300"/>';
  var MAT_TROI = '<circle class="mat-troi" cx="1060" cy="70" r="44"/>';

  // Nhà phố Hội An: tường vàng, mái ngói nâu, đèn lồng trước hiên
  function nhaHoiAn(x, w, cao) {
    var y = 248 - cao;
    var s = '<rect class="vang" x="' + x + '" y="' + y + '" width="' + w + '" height="' + cao + '"/>';
    s += '<path class="go" d="M' + (x - 8) + ' ' + (y + 2) + ' L' + (x + 12) + ' ' + (y - 20) + ' H' + (x + w - 12) + ' L' + (x + w + 8) + ' ' + (y + 2) + ' Z"/>';
    s += '<rect class="go" x="' + (x + w / 2 - 14) + '" y="' + (248 - 46) + '" width="28" height="46"/>';
    s += '<rect class="go" x="' + (x + 12) + '" y="' + (y + 16) + '" width="18" height="16"/><rect class="go" x="' + (x + w - 30) + '" y="' + (y + 16) + '" width="18" height="16"/>';
    s += '<circle class="mai" cx="' + (x + 22) + '" cy="' + (248 - 52) + '" r="7"/><circle class="vang-dam" cx="' + (x + w - 22) + '" cy="' + (248 - 52) + '" r="7"/>';
    return s;
  }

  var CANH = {
    /* Phố cổ Hội An – Chùa Cầu */
    "hoi-an": {
      ten: "canhHoiAn",
      svg: TROI + MAT_TROI + may(110, 60) + may(880, 40, .8) +
        '<path class="net-day" d="M0 28 C300 70 900 70 1200 28"/>' +
        denLong(170, 44, "mai") + denLong(300, 56, "vang") + denLong(430, 62, "mai") + denLong(770, 62, "vang") + denLong(900, 56, "mai") + denLong(1030, 44, "vang") +
        nhaHoiAn(40, 110, 80) + nhaHoiAn(170, 100, 110) + nhaHoiAn(290, 120, 76) +
        nhaHoiAn(790, 120, 76) + nhaHoiAn(930, 100, 110) + nhaHoiAn(1050, 110, 80) +
        '<path class="song" d="M0 246 H1200 V300 H0 Z"/>' +
        '<path class="song-sang" d="M80 268 h50 M260 280 h40 M880 272 h60 M1060 284 h40"/>' +
        // Chùa Cầu
        '<rect class="gach" x="488" y="224" width="22" height="44"/><rect class="gach" x="690" y="224" width="22" height="44"/>' +
        '<path class="go" d="M446 232 Q600 212 754 232 L754 242 Q600 222 446 242 Z"/>' +
        '<rect class="mai" x="500" y="178" width="200" height="46"/>' +
        '<path class="net-day" d="M530 180 v44 M565 180 v44 M600 180 v44 M635 180 v44 M670 180 v44"/>' +
        '<path class="go" d="M476 182 C498 178 504 166 510 158 H690 C696 166 702 178 724 182 Z"/>' +
        '<path class="go" d="M566 160 C578 150 590 144 600 140 C610 144 622 150 634 160 Z"/>' +
        '<path class="net-vang" d="M476 182 C540 186 660 186 724 182"/>' +
        '<path class="thuyen" d="M820 262 C836 274 900 274 916 262 Z"/><path class="non" d="M856 260 L868 246 L880 260 Z"/>'
    },

    /* Hồ Gươm – Tháp Rùa – cầu Thê Húc */
    "ho-guom": {
      ten: "canhHoGuom",
      svg: TROI + MAT_TROI + may(140, 50) + may(860, 70, .8) +
        // hàng cây ven hồ
        '<g class="lua-dam"><ellipse cx="60" cy="200" rx="70" ry="34"/><ellipse cx="190" cy="196" rx="80" ry="38"/><ellipse cx="980" cy="198" rx="90" ry="36"/><ellipse cx="1130" cy="194" rx="90" ry="40"/><ellipse cx="420" cy="206" rx="70" ry="22"/><ellipse cx="870" cy="206" rx="60" ry="20"/></g>' +
        '<path class="song" d="M0 208 H1200 V300 H0 Z"/>' +
        '<path class="song-sang" d="M60 240 h60 M320 262 h50 M900 250 h70 M1080 272 h50"/>' +
        // đền Ngọc Sơn và cầu Thê Húc
        '<rect class="gach" x="120" y="196" width="80" height="34"/><path class="go" d="M108 198 C122 194 128 184 134 178 H186 C192 184 198 194 212 198 Z"/>' +
        '<path class="mai" d="M200 228 C300 186 420 186 520 228 L520 236 C420 196 300 196 200 236 Z"/>' +
        '<path class="net-day" d="M230 216 v-12 M270 204 v-12 M310 197 v-12 M350 194 v-12 M390 194 v-12 M430 197 v-12 M470 205 v-12 M500 214 v-10"/>' +
        '<path class="net-day" d="M210 214 C300 176 420 176 516 218"/>' +
        // Tháp Rùa trên gò nhỏ
        '<ellipse class="lua" cx="760" cy="236" rx="96" ry="14"/>' +
        '<g class="lua-dam"><circle cx="690" cy="222" r="16"/><circle cx="836" cy="222" r="18"/></g>' +
        '<rect class="gach" x="720" y="176" width="80" height="54"/>' +
        '<path class="go" d="M734 230 v-22 a8 8 0 0 1 16 0 v22 Z M752 230 v-26 a8 8 0 0 1 16 0 v26 Z M770 230 v-22 a8 8 0 0 1 16 0 v22 Z"/>' +
        '<rect class="go" x="714" y="172" width="92" height="6"/>' +
        '<rect class="gach" x="732" y="142" width="56" height="30"/>' +
        '<path class="go" d="M742 172 v-16 a6 6 0 0 1 12 0 v16 Z M766 172 v-16 a6 6 0 0 1 12 0 v16 Z"/>' +
        '<rect class="go" x="728" y="138" width="64" height="6"/>' +
        '<rect class="gach" x="744" y="116" width="32" height="22"/><circle class="go" cx="760" cy="127" r="5"/>' +
        '<path class="go" d="M738 118 L760 98 L782 118 Z"/>'
    },

    /* Vịnh Hạ Long – núi đá trên biển, thuyền buồm */
    "ha-long": {
      ten: "canhHaLong",
      svg: TROI + MAT_TROI + may(120, 46) + may(760, 36, .7) +
        '<path class="nui-xa" d="M0 214 C10 150 40 140 52 200 C62 120 104 110 116 196 C130 160 150 158 160 214 Z M250 214 C262 170 280 164 290 214 Z M880 214 C890 140 930 132 944 204 C956 168 980 166 990 214 Z M1110 214 C1120 150 1160 140 1172 200 C1180 180 1196 180 1200 214 Z"/>' +
        '<path class="nui-gan" d="M300 222 C306 130 350 104 372 150 C384 100 430 96 440 160 C450 140 470 142 478 222 Z M720 222 C726 150 760 120 780 160 C790 110 836 100 850 170 C858 150 874 152 880 222 Z M150 222 C156 186 176 178 184 222 Z M1000 222 C1008 180 1030 176 1038 222 Z"/>' +
        '<path class="song" d="M0 214 H1200 V300 H0 Z"/>' +
        '<path class="song-sang" d="M40 246 h70 M220 270 h50 M330 236 h60 M780 240 h60 M960 266 h70 M1100 248 h50"/>' +
        // thuyền buồm nâu
        '<path class="go" d="M512 242 L688 242 L710 222 L490 222 Z"/>' +
        '<path class="net-day" d="M548 222 V138 M600 222 V120 M652 222 V140"/>' +
        '<path class="buom" d="M550 214 V142 Q570 148 586 146 V214 Z"/><path class="buom" d="M602 214 V124 Q626 132 644 130 V214 Z"/><path class="buom" d="M654 214 V146 Q670 152 684 150 V214 Z"/>' +
        '<path class="net-day" d="M550 168 h36 M550 192 h36 M602 150 h42 M602 176 h42 M602 200 h42 M654 172 h30 M654 196 h30"/>' +
        '<path class="song-sang" d="M520 252 h160"/>' +
        '<path class="net-day" d="M360 120 q8 -8 16 0 q8 -8 16 0 M400 100 q6 -6 12 0 q6 -6 12 0"/>'
    },

    /* Đình làng và cây đa */
    "dinh-lang": {
      ten: "canhDinhLang",
      svg: TROI + MAT_TROI + may(150, 50) + may(880, 60, .8) +
        '<path class="lua-sang" d="M0 236 C300 222 900 222 1200 236 V300 H0 Z"/>' +
        '<path class="lua" d="M0 262 C300 252 900 252 1200 262 V300 H0 Z"/>' +
        // cây đa
        '<path class="go" d="M300 252 C306 214 302 186 312 160 L334 160 C344 186 340 214 348 252 Z"/>' +
        '<path class="net-day" d="M290 170 v60 M356 172 v56 M270 168 v40"/>' +
        '<g class="lua-dam"><ellipse cx="280" cy="150" rx="70" ry="40"/><ellipse cx="360" cy="146" rx="74" ry="44"/><ellipse cx="320" cy="116" rx="70" ry="40"/></g>' +
        // đình làng mái cong
        '<rect class="gach" x="468" y="234" width="264" height="16"/>' +
        '<rect class="vang" x="496" y="198" width="208" height="36"/>' +
        '<path class="mai" d="M500 198 h12 v36 h-12 Z M548 198 h12 v36 h-12 Z M594 198 h12 v36 h-12 Z M640 198 h12 v36 h-12 Z M688 198 h12 v36 h-12 Z"/>' +
        '<path class="go" d="M434 204 C470 198 488 176 498 158 L702 158 C712 176 730 198 766 204 C700 210 500 210 434 204 Z"/>' +
        '<path class="go" d="M520 160 L540 136 H660 L680 160 Z"/>' +
        '<path class="net-vang" d="M434 204 C460 196 452 186 446 182 M766 204 C740 196 748 186 754 182 M540 136 C532 128 526 128 522 132 M660 136 C668 128 674 128 678 132"/>' +
        '<circle class="vang" cx="600" cy="132" r="7"/>' +
        // cờ hội
        '<path class="net-day" d="M820 250 V150 M820 154 C880 170 960 170 1040 150 M1040 250 V146"/>' +
        '<path class="mai" d="M836 160 l10 22 l10 -20 Z M884 166 l10 22 l10 -22 Z M936 166 l10 22 l10 -22 Z M988 160 l10 22 l10 -20 Z"/>' +
        '<path class="vang" d="M860 164 l10 22 l10 -22 Z M910 168 l10 22 l10 -22 Z M962 164 l10 22 l10 -22 Z M1012 156 l10 22 l10 -20 Z"/>'
    },

    /* Huế – cầu Trường Tiền, sông Hương, núi Ngự Bình */
    "hue": {
      ten: "canhHue",
      svg: TROI + MAT_TROI + may(120, 56) + may(820, 40, .8) +
        '<path class="nui-xa" d="M760 210 C790 168 820 150 860 148 H980 C1020 150 1050 168 1080 210 Z"/>' +
        '<g class="lua-dam"><ellipse cx="80" cy="206" rx="90" ry="22"/><ellipse cx="300" cy="208" rx="80" ry="18"/><ellipse cx="1150" cy="206" rx="80" ry="22"/></g>' +
        '<path class="song" d="M0 212 H1200 V300 H0 Z"/>' +
        '<path class="song-sang" d="M40 270 h60 M300 282 h50 M820 276 h60 M1080 266 h50"/>' +
        // cầu Trường Tiền: sáu nhịp vòm thép
        '<g class="cau-thep">' +
        '<path d="M180 222 Q250 170 320 222 M320 222 Q390 170 460 222 M460 222 Q530 170 600 222 M600 222 Q670 170 740 222 M740 222 Q810 170 880 222 M880 222 Q950 170 1020 222"/>' +
        '<path class="mong" d="M215 222 v-27 M250 222 v-36 M285 222 v-27 M355 222 v-27 M390 222 v-36 M425 222 v-27 M495 222 v-27 M530 222 v-36 M565 222 v-27 M635 222 v-27 M670 222 v-36 M705 222 v-27 M775 222 v-27 M810 222 v-36 M845 222 v-27 M915 222 v-27 M950 222 v-36 M985 222 v-27"/>' +
        '<path class="mat-cau" d="M170 222 H1030"/>' +
        '</g>' +
        '<path class="gach" d="M314 222 h12 v26 h-12 Z M454 222 h12 v26 h-12 Z M594 222 h12 v26 h-12 Z M734 222 h12 v26 h-12 Z M874 222 h12 v26 h-12 Z"/>' +
        // thuyền rồng
        '<path class="mai" d="M380 268 C400 282 500 282 520 268 Z"/><path class="vang" d="M516 270 C524 256 534 254 538 260 C532 262 528 266 524 272 Z"/><rect class="vang" x="420" y="254" width="50" height="14" rx="3"/>'
    }
  };

  window.CONG_CANH = CANH;
})();
