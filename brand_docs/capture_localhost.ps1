$edge = 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
$out = 'c:\Users\User\Desktop\yakasonshoes\brand_docs\yakason_live_preloader.png'

Start-Process -FilePath $edge -ArgumentList '--headless=new', '--window-size=1440,900', "--screenshot=$out", 'http://localhost:3000' -Wait

Get-Item $out | Select-Object Name, Length
