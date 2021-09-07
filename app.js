const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const PLAYER_STORAGE_KEY = "F8 player"

const disk = $('.spinning-disk')
const diskWidth = disk.offsetWidth
const playBtn = $('#play-button')
const audioNode = $('audio')
const processNode = $('#process-input')
const nextBtn = $('#forward-button')
const prevBtn = $('#backward-button')
const suffleBtn = $('#suffle-button')
const replayBtn = $('#replay-button')
const playList = $('.song-list')

const app = {
    currentIndex: 0,
    isPlaying: true,
    isSuffle: false,
    isReplay: false,
    recentlySongs: [],
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    setConfig: function (key, value) {
        app.config[key] = value
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(app.config))
    },
    loadConfig: function () {
        app.isReplay = app.config.isReplay
        app.isSuffle = app.config.isSuffle
        replayBtn.toggleAttribute('active', app.isReplay)
        suffleBtn.toggleAttribute('active', app.isSuffle)
    },
    songs: [
        {
            "name": "Nevada",
            "singer": "Vicetone",
            "path": "https://aredir.nixcdn.com/NhacCuaTui924/Nevada-Vicetone-4494556.mp3?st=_IjpS9u0LjapNgzm058wVw&e=1623143773",
            "image": "https://avatar-ex-swe.nixcdn.com/song/2018/06/19/7/b/9/3/1529382807600_640.jpg"
        },
        {
            "name": "Light It Up",
            "singer": "Robin Hustin x TobiMorrow",
            "path": "https://aredir.nixcdn.com/NhacCuaTui968/LightItUp-RobinHustinTobimorrowJex-5619031.mp3?st=kzpVQ5kKnf2LlcAqM6lnxg&e=1623143881",
            "image": "https://upload.wikimedia.org/wikipedia/en/d/d1/Light_It_Up_%28Remix%29_Major_Lazer_Cover.jpg"
        },
        {
            "name": "Yoru ni kakeru",
            "singer": "YOASOBI",
            "path": "https://aredir.nixcdn.com/NhacCuaTui992/YoruNiKakeru-YOASOBI-6149490.mp3?st=68hnFhtGF6RukKDcDcW9Mw&e=1623132179",
            "image": "https://upload.wikimedia.org/wikipedia/en/9/93/Yoru_ni_Kakeru_cover_art.jpg"
        },
        {
            "name": "Muộn rồi mà sao còn",
            "singer": "Sơn Tùng M-TP",
            "path": "https://aredir.nixcdn.com/Believe_Audio19/MuonRoiMaSaoCon-SonTungMTP-7011803.mp3?st=w9AA-eyRI7yD_VYGfvVWeQ&e=1623141624",
            "image": "https://i.scdn.co/image/ab67616d0000b27329f906fe7a60df7777b02ee1"
        },
        {
            "name": "See You Again",
            "singer": "Charlie Puth ft Wiz Khalifa",
            "path": "https://aredir.nixcdn.com/NhacCuaTui894/SeeYouAgain-KurtSchneiderEppicAlexGoot-3888930.mp3?st=1q73myBS8FKr8Rx0snpMJw&e=1623144094",
            "image": "https://upload.wikimedia.org/wikipedia/vi/8/8d/CharliePuthSeeYouAgain.png"
        },
        {
            "name": "Symphony",
            "singer": "Clean Bandit",
            "path": "https://aredir.nixcdn.com/Sony_Audio37/Symphony-CleanBanditZaraLarsson-4822950.mp3?st=sPgJSXtRXYpT_rznXyez6g&e=1623144426",
            "image": "https://i1.sndcdn.com/artworks-000367292178-lvqk4w-t500x500.jpg"
        },
        {
            "name": "Waiting For Love",
            "singer": "Avicii",
            "path": "https://aredir.nixcdn.com/Unv_Audio45/WaitingForLove-Avicii-4203283.mp3?st=mXGv6kIqbxg_coAyUqzlnw&e=1623144462",
            "image": "https://upload.wikimedia.org/wikipedia/vi/8/81/Avicii%27s_Waiting_For_Love%2C_Cover_Artwork.png"
        },
        {
            "name": "Alone",
            "singer": "Marshmello",
            "path": "https://aredir.nixcdn.com/NhacCuaTui927/Alone-Marshmello-4456939.mp3?st=RTsMC9tNcKEi8fd0iKtdaA&e=1623144502",
            "image": "https://avatar-ex-swe.nixcdn.com/song/2017/10/12/c/7/4/4/1507777010142_640.jpg"
        },
        {
            "name": "Something Just Like This",
            "singer": "The Chainsmokers & Coldplay",
            "path": "https://aredir.nixcdn.com/Sony_Audio39/SomethingJustLikeThis-TheChainsmokersColdplay-5337136.mp3?st=VQuH6VgNsPlBizbk-c7n3w&e=1623144556",
            "image": "https://avatar-ex-swe.nixcdn.com/song/2017/11/07/a/1/4/5/1510038809679_640.jpg"
        },
        {
            "name": "Sugar",
            "singer": "Maroon 5",
            "path": "https://aredir.nixcdn.com/Unv_Audio73/Sugar-Maroon5-3338455.mp3?st=3FUWEyikJePPeAuREUcw9g&e=1623144644",
            "image": "https://upload.wikimedia.org/wikipedia/vi/2/29/Maroon_5_Sugar_bia_dia_don.png"
        }
    ],
    render: function () {
        var htmls = app.songs.map((song, index) =>
            `<div class="song" songIndex="${index}" ${(index === app.currentIndex) ? 'current' : ''}>
                <div class="song-img" style='
                    background: url("${song.image}")center no-repeat;
                    background-size: contain;'></div>
                <div class="song-info">
                    <h4 class="song-name" style="margin:0;">${song.name}</h4>
                    <span class="song-artist">${song.singer}</span>
                </div>
                <div class="more-option" >...</div>
            </div>
        `)
        playList.innerHTML = htmls.join('')
    },
    loadCurrentSong: function () {
        app.currentSongHTMLUpdate()
        var songNode = $(`.song[index="${this.currentIndex}"]`)
        var songNameNode = $('h2.song-name')
        songNameNode.textContent = this.currentSong.name
        disk.setAttribute("style", `background: url("${this.currentSong.image}")center no-repeat;background-size: contain;'`)
        audioNode.setAttribute('src', `${this.currentSong.path}`)
        app.scrollToActiveSong()
    },
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex]
            }
        })
    },
    currentSongHTMLUpdate: function () {
        $('.song[current]').removeAttribute('current')
        $(`.song[songindex = "${this.currentIndex}"]`).setAttribute('current', '')
    },
    scrollToActiveSong: function () {
        setTimeout(() => {
            $(`.song[current]`).scrollIntoView({
                behavior: 'smooth',
                block: 'end',
            })
        }, 2000)
    },
    nextSong: function () {
        if (this.isSuffle) {
            this.playRandomSong()
        } else app.currentIndex++
        if (app.currentIndex >= app.songs.length)
            app.currentIndex = 0;
        app.scrollToActiveSong()
        //app.currentSongHTMLUpdate()
        app.loadCurrentSong()
    },
    prevSong: function () {
        if (this.isSuffle) app.recentlySongs.push(this.currentIndex)
        app.currentIndex--
        if (app.currentIndex < 0)
            app.currentIndex = app.songs.length - 1;
        app.scrollToActiveSong()
        //app.currentSongHTMLUpdate()
        app.loadCurrentSong()
    },
    handleEvent: function () {

        //Xử lý xoay cd và dừng cd
        const diskAnimate = disk.animate([
            {
                transform: 'rotate(360deg)'
            }],
            {
                duration: 10000, //10sec
                iterations: Infinity
            })
        diskAnimate.pause()

        //Lăn chuột sẽ làm thay đổi thumbnail
        document.onscroll = function () {
            const scrollYPx = window.scrollY || document.documentElement.scrollTop
            const newDiskWidth = (diskWidth - scrollYPx > 0) ? diskWidth - scrollYPx : 0
            disk.style.width = newDiskWidth + 'px'
            disk.style.height = newDiskWidth + 'px'
            disk.style.opacity = newDiskWidth / diskWidth
        }
        //Nhấn nút play sẽ thêm playing cho playBtn
        playBtn.addEventListener('click', function () {
            playBtn.toggleAttribute('playing')
            if (playBtn.hasAttribute('playing'))
                this.isPlaying = true;
            else this.isPlaying = false;
            if (this.isPlaying) {
                audioNode.play()
                diskAnimate.play()
            }
            else {
                audioNode.pause()
                diskAnimate.pause()
            }
        })

        //Thanh process sẽ chạy theo % bài nhạc -- Có lổi làm cho thanh process bị gán giá trị middle
        audioNode.addEventListener('timeupdate', function () {
            if (audioNode.duration)
                processNode.value = (audioNode.currentTime / audioNode.duration) * 100
        })

        //Khi thay đổi thanh tiến trình sẽ thay đổi tiến trình nhạc
        processNode.addEventListener('input', function () {
            var seekTime = (processNode.value * audioNode.duration) / 100
            audioNode.currentTime = seekTime
        })

        //Khi nhấn next và prev
        nextBtn.addEventListener('click', function () {
            app.nextSong()
            if (!this.isPlaying) playBtn.setAttribute('playing', '')
            diskAnimate.cancel()
            audioNode.play()
            diskAnimate.play()
        })
        prevBtn.addEventListener('click', function () {
            app.prevSong()
            if (!this.isPlaying) playBtn.setAttribute('playing', '')
            diskAnimate.cancel()
            audioNode.play()
            diskAnimate.play()
        })

        //Khi nhấn replay
        replayBtn.addEventListener('click', function () {
            app.isReplay = !app.isReplay
            replayBtn.toggleAttribute('active', this.isReplay)
            app.setConfig('isReplay', app.isReplay)
        })

        //Khi nhấn suffle
        suffleBtn.addEventListener('click', function () {
            app.isSuffle = !app.isSuffle
            suffleBtn.toggleAttribute('active', this.isSuffle)
            app.setConfig('isSuffle', app.isSuffle)
        })

        //Khi hết bài tự động chuyển
        audioNode.addEventListener('ended', function () {
            if (app.isReplay) {
                audioNode.play()
            } else
                nextBtn.click()
        })

        //Chọn bài
        playList.addEventListener('click', function (e) {
            if (e.target.closest('.song:not([current])')
                && !e.target.closest('.more-option')) {
                app.currentIndex = e.target.closest('.song:not([current])').getAttribute('songindex')
                app.loadCurrentSong()
                playBtn.toggleAttribute('playing', false)
                playBtn.click()
            }
        })
    },
    playRandomSong: function () {
        if (this.recentlySongs.length === this.songs.length) this.recentlySongs = []
        let nextIndex = 0;
        do {
            nextIndex = Math.floor(Math.random() * this.songs.length)
        } while (nextIndex === this.currentIndex || this.recentlySongs.includes(nextIndex))
        this.currentIndex = nextIndex
        this.recentlySongs.push(this.currentIndex)
    },
    start: function () {
        // Định nghĩa thuộc tính
        this.defineProperties()
        // Load config mà người dùng apply trước đó
        this.loadConfig()
        //Render playlist ra màn hình
        this.render()
        // Lắng nghe event/ Xử lý nuôn
        this.handleEvent()
        //Load bài hát hiện tại
        this.loadCurrentSong()
    }
}
app.start()