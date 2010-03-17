$(function(){

    root = {
        jquery: {
            'DD Panel': {
                basic: {
                    url: "pages/DDPanel/01/index.html"
                },
                zyDDPanel: {
                    url: "pages/DDPanel/02/demo.html"
                }
            },
            grid: {
                basic: {
                    url: "pages/grid/baseGrid/index.html",
                    index: 1
                },
                editCell: {
                    url: "pages/grid/editCell/index.html"
                },
                editRow: {
                    url: "pages/grid/editRow/index.html"
                }
            },
            dialog: {
                basic: {
                    url: "pages/dialog/basic/basic.html"
                },
                withHtml: {
                    url: "pages/dialog/withHtml/01.html"
                },
                withGrid: {
                    url: "pages/dialog/withGridDiv/01.html"
                },
                'cross Frame': {
                    url: "pages/dialog/crossFrame/01.html"
                }
            },
            VD: {
                simple: {
                    url: "pages/jQueryVD/demo.html"
                },
                'multi-status': {
                    url: "pages/jQueryVD/06/page.html"
                },
                'twice-VD': {
                    url: "pages/jQueryVD/multiVD/page.html",
                    index: 'vd'
                }
            },
            marquee: {
                basic: {
                    url: "pages/marquee/marquee.html"
                }
            },
            jTools: {
                wizard: {
                    url: "pages/jQueryTools/scrollable/03.html"
                },
                navigation: {
                    url: "pages/jQueryTools/scrollable/06.html"
                },
                demo: {
                    url: "pages/jQueryTools/scrollable/02.html"
                },
                vertical: {
                    url: "pages/jQueryTools/scrollable/07.html"
                },
                
                tooltip: {
                    url: "pages/jQueryTools/tooltip/demo.html"
                },
                
                tabs: {
                    url: "pages/jQueryTools/tabs/demo.html"
                },
                hAccordion: {
                    url: "pages/jQueryTools/hAccordion/demo.html"
                }
            
            },
            tooltip: {
                'bassistance': {
                    url: "pages/tooltip/bassistance/01.html"
                },
                'boxover': {
                    url: "pages/tooltip/boxover/01.html"
                }
            },
            chart:{
                'test1':{url: "others/jquery.jqplot.0.9.4/dist/test1.html", index: 'jQueryChart01'},
                'test2':{url: "others/jquery.jqplot.0.9.4/dist/test2.html", index: 'jQueryChart02'},
                'test3':{url: "others/jquery.jqplot.0.9.4/dist/test3.html"},
                'test4':{url: "others/jquery.jqplot.0.9.4/dist/test4.html"},
                'test5':{url: "others/jquery.jqplot.0.9.4/dist/test5.html"},
                'test6':{url: "others/jquery.jqplot.0.9.4/dist/test6.html"},
                'test7':{url: "others/jquery.jqplot.0.9.4/dist/test7.html"},
                'test8':{url: "others/jquery.jqplot.0.9.4/dist/test8.html"},
                'test9':{url: "others/jquery.jqplot.0.9.4/dist/test9.html"},
                'test10':{url: "others/jquery.jqplot.0.9.4/dist/test10.html"},
                'test11':{url: "others/jquery.jqplot.0.9.4/dist/test11.html"},
                'test12':{url: "others/jquery.jqplot.0.9.4/dist/test12.html"},
                'test13':{url: "others/jquery.jqplot.0.9.4/dist/test13.html"},
                'test14':{url: "others/jquery.jqplot.0.9.4/dist/test14.html"},
                'test15':{url: "others/jquery.jqplot.0.9.4/dist/test15.html"},
                'test16':{url: "others/jquery.jqplot.0.9.4/dist/test16.html"},
                'test17':{url: "others/jquery.jqplot.0.9.4/dist/test17.html"},
                'test18':{url: "others/jquery.jqplot.0.9.4/dist/test18.html"},
                'test19':{url: "others/jquery.jqplot.0.9.4/dist/test19.html"},
                'test20':{url: "others/jquery.jqplot.0.9.4/dist/test20.html"},
                'test21':{url: "others/jquery.jqplot.0.9.4/dist/test21.html"},
                'test22':{url: "others/jquery.jqplot.0.9.4/dist/test22.html"},
                'test23':{url: "others/jquery.jqplot.0.9.4/dist/test23.html"},
                'test24':{url: "others/jquery.jqplot.0.9.4/dist/test24.html"},
                'test25':{url: "others/jquery.jqplot.0.9.4/dist/test25.html"},
                'test26':{url: "others/jquery.jqplot.0.9.4/dist/test26.html"},
                'test27':{url: "others/jquery.jqplot.0.9.4/dist/test27.html"},
            },
            menu: {
                'single layer':{
                    url:"pages/menu/01/demo.html"
                },
                'lavalamp':{
                    url:"pages/menu/02/demo.html"
                }
                },
            others: {
                'date picker': {url: "pages/others/datePicker/demo.html"},
                'inline Edit': {url: "pages/others/inlineEdit/01.html"},
                'editable': {url: "pages/others/editable/01.html"},
                'loading Mask': {url: "pages/others/loadingMask/01.html"},
                'loading Mask 2': {url: "pages/others/loadingMask_2/demo.html"},
                'disconnect message': {url: "pages/others/disconnectMsg/demo.html"},
                'growl': {url: "pages/others/growl/demo.html"},
                'orderMenu': {url: "pages/others/orderMenu/index2.html"},
                'slider': {url: "pages/others/slider/demo.html"},
                'dock': {url: "pages/others/jqDock/demo.html"},
                'hrzAccordion': {url: "pages/others/hrzAccordion/demo.html"},
                'zyDock' : {url : "pages/others/zyDock/femto.html"},
                'zyFlow' : {url : "pages/others/zyflow4/demo.html"},
                'table Sorting' : {url : "pages/others/tableSorting/demo.html"},
                'text Overflow' : {url : "pages/others/textOverflow/demo.html"}, 
                'zyMask': {url : "pages/others/zyMask/demo.html"},
                'easing calculater': {url : "pages/others/easing/demo2.html"}, 
                'zySpinBtn':{url:"pages/others/zySpinBtn2/demo.html"}
                
            },
            animation: {
                'chainable Effects': {
                    url: "pages/animation/chainableEffects/chainableEffects.html"
                },
                '3D text': {
                    url: "pages/animation/3d/01.html"
                },
                '3D image': {
                    url: "pages/animation/3d/02.html"
                }
            },
              'project': {
                  'verizon': {
                      url: "pages/project/verizon/index.html"
                  }
              }
        
        }
        
        //-------------------------------
        ,flash: {
        
            '3D': {
                base: {
                    url: "flash/pages/3D/base/01.html",
                    index: 'flash3DBase'
                },
				paper3D:
				{
				  url: "flash/pages/3D/three/01.html", index: 'flash3Dpaper3D'
				},
				
				carousel:
				{
				  url: "flash/pages/3D/two/demo.html", index: 'flash3Dcarousel'
				},
				
			
				'coverFlow 2':
				{
				   url:"flash/pages/3D/coverFlow2/01.html", index: 'flash3DcoverFlow2'
				},
                'coverFlow 3':
                {
                   url:"flash/pages/3D/coverFlow3/01.html", index: 'flash3DcoverFlow2'
                }
				
            },
			
            
            'open flash chart': {
                web: {
                    url: "flash/pages/flashChart/openFlashChart/8 ChartStyle/chart.html",
                    index: 'openFlashChart'
                }
            },
			others:{
			interacteJS:{ url: "flash/pages/interacteJS/demo.html"}
			}
        
        }
        
        //-------------------------------
        ,extjs: {
	     	Grid:{
			  base: {url: "extjs2/GridDemo/gridDemo.html"},
			  customedBtn: {url: "extjs2/GridDemo/customedBtn.html"},
			  editorGridDemo: {url: "extjs2/GridDemo/editorGridDemo.html"},
			  allEditRow: {url: "extjs2/GridDemo/allEditRow.html"},
			  hideTBbar: {url: "extjs2/GridDemo/hideTBbar.html"}
			},
            VD: {
               // withJQueryVD: {url: "extjs/pages/VD/複製 -複製 -03-03-02.html"},
                withJQueryVD: {url: "extjs/pages/twiceVD/page.html", index: 'extjsWithJQueryVD'}
            }
     
            
         
			

        
        }
    
    
    }
    
    
});
