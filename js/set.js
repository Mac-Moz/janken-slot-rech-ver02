
score = 0;
slot_speed = null;
sec = 0
var atari_emoji = null;
var kakuhenFlag = null;
// $('#score').text("スコア" + score + "ポイント");

// じゃんけんを始めるボタンを押したときのアクション//
$('.btn-janken-start').click(function () {
    $('.janken-aite').addClass("slideshow")
    $('.janken button').attr('disabled', false);
    //スコア表示に関するテストコード
    score += 30;
    $('#score').text("スコア" + score + "ポイント");
    $('.header').addClass("header_animation");
    $(".janken-reel").css("opacity", 0).show().animate({ opacity: 1 }, 3000);
}
);

// ”はじめる”を押したときの動作
$('.btn-janken').click(function () {
    // じゃんけんをする
    janken($(this).attr("data-val"));
    // ボタンを非有効にする
    $('.janken button').attr('disabled', true);
    $("#play-janken").get(0).play();
    score += 30;
});


function janken(index) {
    var kekka = []
    var hantei = null
    // 自分の手と相手の手を配列で区分 0:グー、1:チョキ、2:パー
    var aiko = [[0, 0], [1, 1], [2, 2]]
    var kachi = [[0, 1], [1, 2], [2, 0]]
    var make = [[0, 2], [1, 0], [2, 1]]
    // 自分の手と相手の手を配列として追加（push)
    kekka.push(Number(index), (Math.floor(Math.random() * 3)));
    // じゃんけんのスライドアニメーションに2秒、結果表示に1行のSetTimeoutを設定
    setTimeout(function () {
        $('.janken-aite').css("opacity", 0).hide().animate({ opacity: 1 }, 1000);
        // 相手の手を表示する
        if (kekka[1] == 0) {
            $('#janken').append('<img src="img/janken-01-gu.png" alt="">');
        } else if (kekka[1] == 1) {
            $('#janken').append('<img src="img/janken-02-choki.png" alt="">');
        } else if (kekka[1] == 2) {
            $('#janken').append('<img src="img/janken-03-pa.png" alt="">');
        }
        // じゃんけんの勝敗を表示する。スロットの難易度を設定する。

        setTimeout(function () {


            for (var i = 0; i < aiko.length; i++) {

                // $('.wrap ul').remove();// 相手のじゃんけんアニメーションを削除
                // $('#janken').removeClass("wrap");//flexboxを削除
                //じゃんけんの結果を表示する。スロットの難易度設定を変更する
                if (aiko[i].toString() == kekka.toString()) {
                    $('#janken').append("<h1 id = kekka>あいこ</h1>", "<h1 id = kekka02>スピード：🤨</h1>");
                    sec = 500;
                    slot_speed = "スピード：🤨";
                    $("#play-aiko").get(0).play();
                } else if (kachi[i].toString() == kekka.toString()) {
                    $('#janken').append("<h1 id = kekka>かち</h1>", "<h1 id = kekka02>スピード：😎</h1>");
                    sec = 1000;
                    slot_speed = "スピード：😎";
                    $("#play-kachi").get(0).play();
                } else if (make[i].toString() == kekka.toString()) {
                    $('#janken').append("<h1 id = kekka>まけ</h1>", "<h1 id = kekka02>スピード：👺</h1>");
                    sec = 10;
                    slot_speed = "スピード：👺";
                    $("#play-make").get(0).play();
                    kakuhenFlag = Math.floor(Math.random() * 2); // 負けの時だけスロットのかくへんフラグが立つ
                    console.log("kakuhenFlag", kakuhenFlag)
                }
                $('#speed').text(slot_speed).show();

            }
            setTimeout(function () {
                // じゃんけんの非表示とスロットの表示アニメーション
                $('.btn-start').attr('disabled', false);
                $(".slot-show").css("opacity", 0).show().animate({ opacity: 1 }, 1000);
                $(".janken-show").css("opacity", 0).hide().animate({ opacity: 1 }, 1000);
                $('#kekka').remove();
                $('#kekka02').remove();
                $('#janken h1').remove();
                $('#janken img').remove();
                // スロットの初期化処理（表示後にスロットの位置を初期化する必要がある）
                Slot.init();
                Slot.resetLocationInfo();
            }, 3000);
        }, 1000);

    }, 2000);




}


(function (global) {
    "use strict";

    /*
     * スロットのリール回転速度(実行毎秒数)
     */
    // var sec = sec;



    /**
     * リールの数
     */
    var $reels = [],//各リール(1-3)
        stopReelFlag = [], //リールを止めたときの判定
        reelCounts = [],//リールを移動カウント（0-6)
        endReelFlag = [],//リールを止めたフラグ設定
        reelEndPosion = [];//リールを止めた位置（0-6)


    /*
     * 位置情報
     */
    var slotFrameHeight = 0,//フレームの高さを格納
        slotReelsHeight = 0,//スロットリール全体の高さItemHeigt*絵の枚数
        slotReelItemHeight = 0,//当たりの画像を格納
        slotReelStart = 0,
        slotReelStartHeight = 0,//リールの初期位置
        atariHantei = null,//当たり判定
        atariGazo = null,//当たりの画像を格納
        atariGazo_img = ["img/yunicorn-atari.jpg", "img/cat-atari.jpg", "img/rion-atari.jpg", "img/zou-atari.jpg", "img/mukudori-atari.jpg", "img/dragon-atari.jpg", "img/hakucho-atari.jpg"],
        hazureGazo = "img/result-01-hazure.png";
    var slot_Atari = [[[0, 6], [1, 1], [2, 2]], [[0, 5], [1, 3], [2, 4]], [[0, 4], [1, 5], [2, 6]], [[0, 3], [1, 2], [2, 0]], [[0, 2], [1, 6], [2, 3]], [[0, 1], [1, 0], [2, 1]], [[0, 0], [1, 4], [2, 5]]]
    // ユニコーン、猫、ライオン、象、ムクドリ、ドラゴン、白鳥の絵がそろった位置を格納
    var slot_emoji = ["🦄", "🐈", "🦁", "🐘", "🐧", "🐲", "🦢"];


    /**
     * スロット
     */
    var Slot = {
        /**
         * 初期化処理
         */
        init: function init() {
            $reels[0] = $reels[1] = $reels[2] = null;
            stopReelFlag[0] = stopReelFlag[1] = stopReelFlag[2] = false;
            endReelFlag[0] = endReelFlag[1] = endReelFlag[2] = false;
            reelCounts[0] = reelCounts[1] = reelCounts[2] = 0;
            reelEndPosion = [];
            atariHantei = null;//当たり判定
            atariGazo = null;//当たりの画像を格納
            atari_emoji = null
        },
        /**
         * スタートボタンのクリックイベント
         */
        start: function () {
            for (var index = 0; index < 3; index++) {
                Slot.animation(index);
            }
        },
        /**
         * ストップボタンのクリックイベント
         */
        stop: function (index) {
            stopReelFlag[index] = true;
            if (stopReelFlag[0] && stopReelFlag[1] && stopReelFlag[2]) {
                $('.btn-result').attr('disabled', false); //結果ボタンを有効にする
            }
        },
        /**スロットの結果を判定 */
        result: function (index) {
            for (var i = 0; i < slot_Atari.length; i++) {
                if (slot_Atari[i].toString() == reelEndPosion.toString()) {
                    atariHantei = true
                    atariGazo = atariGazo_img[i] //合致した当たり判定の番号を格納
                    atari_emoji = slot_emoji[i]
                    console.log(atari_emoji)
                } else {
                }
                $('.btn-reset').attr('disabled', false);
            }
            if (atariHantei == true) {
                $('.atari').text("おめでとう！");
                $(".result-show img").attr("src", atariGazo);
                $(".result-show").css({ opacity: 0, }).show().animate({ opacity: 1 }, 3000);
                // $('.atari__efect').show();

            } else {
                $(".result-show").css({ opacity: 0, }).show().animate({ opacity: 1 }, 3000);
                $(".result-show img").attr("src", hazureGazo);

            }
        },
        /**
         * 位置情報の初期化処理
         */
        resetLocationInfo: function () {
            console.log("slotFrameHeight", slotFrameHeight, "slotReelsHeight", slotReelsHeight, "slotReelStartHeight", slotReelStartHeight, "slotReelItemHeight", slotReelItemHeight);
            //slot全体の高さを取得
            slotFrameHeight = $('.slot-frame').outerHeight();
            //slotリールの高さを取得 270px * 8 =2160px
            slotReelsHeight = $('.reels').eq(0).outerHeight();
            //コンテンツの高さを取得 css reelsで270pxに指定
            slotReelItemHeight = $('.reel').eq(0).outerHeight();

            slotReelStart = 5 - 2;
            // リールの上下は、半分だけ表示させるための位置調整
            slotReelStartHeight = -slotReelsHeight;
            // (リール全体の長さ*-1 + slot全体の長さ)これが余白部分 + (コンテンツ1.5個分)‐slot全体の長さの半分）
            slotReelStartHeight = slotReelStartHeight + slotFrameHeight + ((slotReelItemHeight * 3 / 2) - (slotFrameHeight / 2)) + slotReelItemHeight;
            console.log("slotFrameHeight", slotFrameHeight, "slotReelsHeight", slotReelsHeight, "slotReelStartHeight", slotReelStartHeight, "slotReelItemHeight", slotReelItemHeight);
            $('.reels').css({
                'top': slotReelStartHeight
            });
        },
        /**
         * スロットの回転アニメーション
         */
        animation: function (index) {
            console.log('アニメーション', '開始', index);
            if (reelCounts[index] >= 7) {
                reelCounts[index] = 0;
                // リールを初期位置のひとつ前の画像に戻してループさせる
                // stopReelFlagの状態により、ループさせるスロットを制御（止めたリールはループさせない）
                if (stopReelFlag[0] == false) {
                    $('.reels:nth-child(1)').css('top', slotReelStartHeight - slotReelItemHeight);
                    $('.reels:nth-child(2)').css('top', slotReelStartHeight - slotReelItemHeight);
                    $('.reels:nth-child(3)').css('top', slotReelStartHeight - slotReelItemHeight);
                }
                if (stopReelFlag[0] == true && stopReelFlag[1] == false) {
                    $('.reels:nth-child(2)').css('top', slotReelStartHeight - slotReelItemHeight);
                    $('.reels:nth-child(3)').css('top', slotReelStartHeight - slotReelItemHeight);
                }
                if (stopReelFlag[0] == true && stopReelFlag[1] == true) {
                    $('.reels:nth-child(3)').css('top', slotReelStartHeight - slotReelItemHeight);
                }
            }
            //リールの情報をログとして残す
            console.log('slotReelStartHeight', slotReelStartHeight);
            console.log('reelCounts[index]', reelCounts[index]);
            console.log('slotReelsHeight', slotReelsHeight);
            console.log('top', slotReelStartHeight + (reelCounts[index] * slotReelItemHeight));
            /**リールのアニメーション topの表示位置を0‐6で移動させる */
            $('.reels').eq(index).animate({
                'top': slotReelStartHeight + (reelCounts[index] * slotReelItemHeight)
            }, {
                duration: sec,
                easing: 'linear',
                complete: function () {
                    console.log('アニメーション', '完了', index, reelCounts[index]);
                    console.log('リールフラグ', stopReelFlag[0], stopReelFlag[1], stopReelFlag[2]);
                    if (stopReelFlag[index]) {
                        console.log('アニメーション', 'ストップ', index, reelCounts[index]);
                        console.log('ストップリール', stopReelFlag[index], reelCounts[index], slotReelStartHeight);
                        //リール位置の取得
                        reelEndPosion.push([index, reelCounts[index]]);
                        console.log("reelEndPosion", reelEndPosion);
                        console.log("endReelFlag", endReelFlag[index])
                        return;
                    }
                    // 移動階数をカウント
                    reelCounts[index]++;
                    // スロット回転のアニメーションを実行する
                    Slot.animation(index);
                }
            });
        },
        resultaction: function () {
            //slotの非表示と結果の表示
            $('.result-hide').hide();
            $('.result-show').show();
            $('#speed').text("どうぶつバッチ").show();
            if (atariHantei == true) {
                $("#reslut_text").css("opacity", 0).text("オメデトウ" + atari_emoji + "ゲット").animate({ opacity: 1 }, 1000);
                $("#atari").css("opacity", 0).append(atari_emoji).animate({ opacity: 1 }, 3000);
                $("#slot-atari").get(0).play();
            } else {
                $("#reslut_text").css("opacity", 0).text("ざんねんはずれ").animate({ opacity: 1 }, 1000);
                $("#atari").css("opacity", 0).append(atari_emoji).animate({ opacity: 1 }, 3000);
                $("#slot-hazure").get(0).play();
            }

        },
        kakuhen: function () {
            var random = Math.floor(Math.random() * 7);
            $('.reels:nth-child(1)').animate({ top: slotReelStartHeight + (slot_Atari[random][0][1] * slotReelItemHeight) }, 5000);
            $('.reels:nth-child(2)').animate({ top: slotReelStartHeight + (slot_Atari[random][1][1] * slotReelItemHeight) }, 5000);
            $('.reels:nth-child(3)').animate({ top: slotReelStartHeight + (slot_Atari[random][2][1] * slotReelItemHeight) }, 5000);
            reelEndPosion = [];
            reelEndPosion.push(slot_Atari[random]);
        },
    }


    global.Slot = Slot;

})((this || 0).self || global);


$(document).ready(function () {
    /**
     * スタートボタンのクリックイベント
     */
    $('.btn-start').click(function () {
        // スタートボタンを押せないようにする
        $(this).attr('disabled', true);
        // スロットの回転を開始
        Slot.start();
        // ストップボタンを押せるようにする
        $('.btn-0').attr('disabled', false);
    });

    $('.btn-0').click(function () {
        // ストップボタン1を押せるようにする
        $('.btn-1').attr('disabled', false);
    });

    $('.btn-1').click(function () {
        // ストップボタン2を押せるようにする
        $('.btn-2').attr('disabled', false);
        $('.Slobt-btn-consle').show();
    });

    $('.btn-2').click(function () {
       
        console.log("kakuhenFlag", kakuhenFlag);
    
        if (kakuhenFlag == 1) {
            $(".btn-kakuhen").css("opacity", 0).show().animate({ opacity: 1 }, 2000);
        };
           
        kakuhenFlag = null;
    });

    /**
     * リセットボタンのクリックイベント
     */
    $('.btn-reset').click(function () {
        // リセットボタンを押せないようにする
        // $(this).attr('disabled', true);
        //     // スタートボタンを押せるようにする
        //     $('.btn-start').attr('disabled', false);
        //     // ストップボタンを押せないようにする
        //     $('.btn-stop').attr('disabled', true);
        //     // スロットのリール情報を初期化
        Slot.init();
        $(".janken-show").css("opacity", 0).show().animate({ opacity: 1 }, 1000);
        $(".result-show").css("opacity", 0).hide().animate({ opacity: 1 }, 1000);
        $(".result-hide").css("opacity", 0).show().animate({ opacity: 1 }, 1000);
        $(".janken-reel").css("opacity", 0).show().animate({ opacity: 1 }, 1000);
        $(".slot-show").css("opacity", 0).hide().animate({ opacity: 1 }, 1000);
        $('.janken button').attr('disabled', false);
        $('#speed').text("").show();
    });

    /**
     * ストップボタンのクリックイベント
     */
    $('.btn-stop').click(function () {
        // ストップボタンを押せないようにする
        $(this).attr('disabled', true);
        // レールの回転を停止
        Slot.stop($(this).attr('data-val'));
        // 結果の評価
        // Slot.reslut($(this).attr('data-val'));
    });
    /**
 * リザルトのクリックイベント
 */
    $('.btn-result').click(function () {

        // 結果の評価
        Slot.result($(this).attr('data-val'));
        $(this).attr('disabled', true);
        Slot.resultaction();
    });
    $('.btn-kakuhen').click(function () {
        $("#kakuhen-audio").get(0).play();
        // 結果の評価
        Slot.kakuhen();
        $(".btn-kakuhen").css("opacity", 0).hide().animate({ opacity: 1 }, 2000);
    });

});

