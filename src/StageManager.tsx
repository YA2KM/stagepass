import {Button, List, ListItem, ListItemButton, ListItemText, Switch} from "@mui/material";
import {createRef, DragEvent, useState} from "react";
import Video from "./entity/Video.ts";

let playerCanvasCtx: CanvasRenderingContext2D | null = null

function StageManager() {
    const [videoSrc, setVideoSrc] = useState<string>("")
    const [videoList, setVideoList] = useState<Video[]>([])
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0)
    const videoRef = createRef<HTMLVideoElement>()
    const [currentPlayingVideo, setCurrentPlayingVideo] = useState<Video | null>()
    const [remainMode, setRemainMode] = useState(false)


    const dropHandler = (e: DragEvent<HTMLElement>) => {
        e.preventDefault()
        if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
            const newVideoList = [...videoList];
            [...e.dataTransfer.items].forEach(item => {
                const file = item.getAsFile()
                if (file) {
                    newVideoList.push(new Video(file))
                }
            })
            setVideoList(newVideoList)
        }
    }

    //1フレハンドラー
    setInterval(() => {
        if (videoRef.current) {
            const videoElement = videoRef.current
            setCurrentTime(videoElement.currentTime ?? 0)
            setDuration(videoElement.duration ?? 0)
            if (playerCanvasCtx) {
                playerCanvasCtx.drawImage(videoElement, 0, 0, 1920, 1080)
            }
        }
    }, 33.333)

    const listClickHandler = (video: Video) => {
        setCurrentPlayingVideo(video)
        setVideoSrc(URL.createObjectURL(video.file))
    }

    const openPlayer = () => {
        const subWindow = window.open("about:blank", "player")
        if (!subWindow) {
            return
        }
        const subdoc = subWindow.document
        const playerCanvas = subdoc.createElement('canvas')
        playerCanvas.style.height = '100%'
        playerCanvas.style.margin = '0 auto'
        playerCanvas.style.display = 'block'
        playerCanvas.height = 1080
        playerCanvas.width = 1920
        subdoc.body.style.background = 'black'
        subdoc.body.style.margin = '0'
        subdoc.body.append(playerCanvas)

        playerCanvasCtx = playerCanvas.getContext('2d')
    }

    const fillz = (value: number) => ('00' + value).slice(-2)

    return <>
        <div className="header eight-seg" style={{background: "black", height: 75, display: "flex"}}>
            <div className="left" style={{width: '23.333%'}}>
            </div>
            <div className="center" style={{width: '53.333%', textAlign: "center"}}>
                <span className="timecode"
                      style={{color: "red", fontSize: 50}}>
                    {fillz(Math.floor(currentTime / 60))}:{fillz(Math.floor(currentTime % 60))}:{fillz(Math.floor(currentTime * 30) % 30)}
                </span>
                {remainMode ? null : <span className="timecode" style={{fontSize: 50}}>_</span>}
                <span className="timecode" onClick={() => setRemainMode(!remainMode)}
                      style={{color: "blue", fontSize: 50}}>
                    {remainMode
                        ? <>-{fillz(Math.floor((duration - currentTime) / 60))}:{fillz(Math.floor((duration - currentTime) % 60))}:{fillz(Math.floor((duration - currentTime) * 30) % 30)}</>
                        : <>{fillz(Math.floor(duration / 60))}:{fillz(Math.floor(duration % 60))}:{fillz(Math.floor(duration * 30) % 30)}</>
                    }
                </span>
            </div>
            <div className="right" style={{width: '23.333%', textAlign: "right"}}>
                <Button variant="outlined" onClick={openPlayer}>
                    open player
                </Button>
            </div>

        </div>
        <List
            sx={{height: 500}}
            onDragOver={(e) => e.preventDefault()}
            onDrop={dropHandler}
        >
            {videoList.map(video =>
                <ListItem key={video.key} onClick={() => listClickHandler(video)}
                >
                    <Switch
                        edge="end"
                        checked={video === currentPlayingVideo}
                        readOnly={true}
                    />
                    <ListItemButton
                    >
                        <ListItemText primary={video.getTitle()}/>
                    </ListItemButton>
                </ListItem>
            )}

        </List>
        <div style={{background: "black"}}>
            <video ref={videoRef} style={{width: '50%', display: "block", margin: "0 auto"}} src={videoSrc}
                   autoPlay={true}></video>
        </div>
    </>
}

export default StageManager