http://hie/Brick/verizon/index.html

menu.json 定義了兩件事 1. menu/submenu的結構  2.點下去的連結


中間frame裝以下兩種形式的html

單頁：
http://hie/Brick/verizon/pages/networkMap.html
tab頁：
http://hie/Brick/verizon/pages/tabFW/tabFW.html?tabJson=../networkSettings/wireless/tab.json


tab頁本身沒東西，如：
http://hie/Brick/verizon/pages/tabFW/tabFW.html

給它tabJson data
?tabJson=../networkSettings/wireless/tab.json

就會動態長出tab



tabJson 定義如下：

tab名稱 / tab內容


 {
         "General": {"url":"../networkSettings/wireless/general.html"  },
         "More AP": {"url":"../networkSettings/wireless/moreAP.html"  },
         "WPS": {"url":"../networkSettings/wireless/wps.html"  },
         "WPS Station": {"url":"../networkSettings/wireless/wpsStation.html"  },
         "WDS": {"url":"../networkSettings/wireless/wds.html"  },
         "Advanced Setup": {"url":"../networkSettings/wireless/advancedSetup.html"  }
  }


http://hie/Brick/verizon/index.html?menu=networkSettings-broadband
parent.window.document.activePage('a-a3', 2);
http://hie/Brick/verizon/index.html?menu=networkSettings-wireless&&tabIndex=2




