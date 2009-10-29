

package
{
	import flash.display.InteractiveObject;
	import flash.display.MovieClip;
	//匯入MovieClip類別。
	import flash.events.Event;
	//匯入Event類別。
	import org.papervision3d.view.BasicView;
	//匯入BasicView類別。
	
	import org.papervision3d.materials.ColorMaterial;
	import org.papervision3d.objects.primitives.Plane;
	
	import caurina.transitions.Tweener;
	
	import com.adobe.serialization.json.JSON;

	//3d 互動類別
	import org.papervision3d.events.InteractiveScene3DEvent;
	
    import com.adobe.serialization.json.JSON;
	
	import flash.external.ExternalInterface;

	import flash.net.URLRequest ;
    import flash.net.URLLoader ;
import flash.events.*;

	public class first3D extends MovieClip {	
		//A01_BasicDocument類別, 繼承MovieClip。		
		private var view:BasicView;
		private var plane:Plane;
		
		var loader:URLLoader = new URLLoader() ;
        var request:URLRequest = new URLRequest() ;



function decodeJSON(event:Event):void {

var loader:URLLoader = URLLoader(event.target) ;
var people:* = JSON.decode(loader.data) ;
trace(people.caa1.name);
  ExternalInterface.call("alert", people.caa1.name);

}


			public var aaa:String = "'from flash'";
		//宣告view變數, 型別為BasicView。		
		public function first3D():void{
			//建構函式, 該類別被實體化時, 會執行一次。
			//可以把要初始化的值或物件寫在這。	
			init3DEngine();
			//執行init3DEngine函式。
			init3DObject();
			//執行init3DObject函式。
		}
		
		function getTextFromJavaScript(str:String):void {
        //ExternalInterface.call("alert", 'from flash');
        on3DClick(null);
        }

		

	
		function 	getJsonFromJavaScript(path:String):void {

request.url = path ;
loader.load(request) ;
loader.addEventListener(Event.COMPLETE, decodeJSON) ;

		/*	var people:*  = JSON.decode(dataa) ;
            ExternalInterface.call("alert", people.caa1.name);
			trace(people.caa1.name);*/
        }
		

		private function init3DEngine():void {
			



			//此函式的用意是用來建立PV3D所需的基本類別。
			//在此建構BasicView物件、設定Camera參數。
			view = new BasicView(0, 0, true, true, "Target");	
			view.viewport.buttonMode = true;
			/*
			建構BasicView物件
			new BasicView(
				viewport寬度		:Number,
				viewport高度		:Number,
				是否自動對齊場景	:Boolean, 
				是否開啟滑鼠感應功能:Boolean,
				camera類別			:String
				) 			
			*/
			this.addChild(view);			
			//BasicView是繼承Sprite, 可被加入至可視物件容器裡。			
			this.addEventListener(Event.ENTER_FRAME, onEventRender3D);	
			//偵聽 Event.ENTER_FRAME 事件, 以便持續更新畫面
			
			
			ExternalInterface.addCallback("sendTextToFlash", getTextFromJavaScript);
			ExternalInterface.addCallback("sendJsonToFlash", getJsonFromJavaScript);

		}

		//var  testJson:String  = '{ "caa1": {"name":"Jaylo", "number":"3243251"}, "caa2": {"name":"Jenny", "number":"8675309"}}';

		//var testJson:String = '{"age":23,"sex":"Male","name":"Joseph"}';
		private function init3DObject():void{
			//init3DObject函式, 用來建立PV3D物件、材質及偵聽事件。
			var colorMat:ColorMaterial = new ColorMaterial(0xa7c520, 1);
			colorMat.doubleSided = true;
			plane = new Plane(colorMat, 500, 500);
			
			//開啟interactive 模式
			colorMat.interactive = true;
			plane.addEventListener(InteractiveScene3DEvent.OBJECT_CLICK, on3DClick);
				

			view.scene.addChild(plane);	
			
			   getJsonFromJavaScript("data.js");
			}
			
			
			var cameraFlag = 0;
			private function on3DClick(e:InteractiveScene3DEvent):void {
				
				 

				 
				var naviX:int = 1000;
				var naviY:int = 1000;
				if (cameraFlag == 0)
				{
					naviX = 1000;
					naviY = 1000;
					
					cameraFlag = 1;
					ExternalInterface.call("getTextFromFlash", 'change camera');
					
					}
					else		
					{
					naviX = 0;
					naviY = 0;
					cameraFlag = 0;
					
					ExternalInterface.call("getTextFromFlash", 'original camera');
					
						}
					
					Tweener.addTween(view.camera, {
					x:naviX,
					y: naviY, 
					time:2
					})
				}
				
				
				
				
		private function onEventRender3D(e:Event):void {			
	//	plane.rotationY+=3;
			view.singleRender();
			//運算view物件。
			//使用算圖類別, 運算Camera所看到的Scene3D世界
			//並將結果呈顯在Viewport3D裡。
		}
	}
}

			
		