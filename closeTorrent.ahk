SetTitleMatchMode, 2
;Run, C:\Users\Graeme\AppData\Roaming\uTorrent\uTorrent.exe

IfWinExist, �Torrent
{
  
  WinActivate, �Torrent
  Send, {tab}, !f, x
  ;Sleep 5000
  ;WinGet, pid, PID, orrent
  ;Process, Close, %pid%

}