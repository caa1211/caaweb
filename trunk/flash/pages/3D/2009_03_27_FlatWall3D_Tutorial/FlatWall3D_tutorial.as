package{
	import fl.controls.Slider;
	import fl.events.SliderEvent;
    import flash.display.*;
    import flash.events.*;	
	import flash.filters.GlowFilter;		
	import milkmidi.papervision3d.materials.ReflectionFileMaterial;	
	
	import org.papervision3d.core.proto.MaterialObject3D;
	import org.papervision3d.objects.DisplayObject3D;
	import org.papervision3d.objects.primitives.Plane;	
    import org.papervision3d.materials.*;
	import org.papervision3d.events.*;
	import caurina.transitions.Tweener;	
	import org.papervision3d.view.BasicView;
	
	[SWF(width = "950", height = "750", frameRate = "61", backgroundColor = "#000000", pageTitle = "milkmidi.com")]	
	
    public class FlatWall3D_tutorial extends BasicView 	{		
		public var slider_mc		:Slider;		
		private var itemOfNumber	:int = 21;		//圖片數量
		private var cameraX			:Number = 0;	//camera的目標x軸
		private var cameraY			:Number = 0;	//camera的目標y軸
		private var cameraZ			:Number = -1000;//camera的目標z軸
		private var cameraZMin		:Number = -1500;//cameraZ軸的最小值
		private var cameraZMax		:Number = -150;	//cameraZ軸的最大值	
		private var _currentPlane			:Plane;
		private const PLANE_TWEEN_TIME		:Number = 2;
		private const PLANE_TRANSITION		:String = "easeOutQuint";
		private const PLANE_MOVE_FORWARD	:Number = 150;
		private const CAMERA_Z_DEFAULT		:Number = -800;		
		private var _isSliderMouseDown		:Boolean = false;
		private static const MIN_VALUE		:Number = 0.02;
        public function FlatWall3D_tutorial() {			
			
			super(0, 0, true, true, "Free");	
			camera.z = -2500;
			camera.x = -1000;
			cameraZ = CAMERA_Z_DEFAULT;
			viewport.buttonMode = true;
			init3DObject();
			initObject();			
			stage.scaleMode = StageScaleMode.NO_SCALE;
			stage.align = StageAlign.TOP_LEFT;
			stage.addEventListener(Event.RESIZE , function (e:Event):void {
				slider_mc.x = stage.stageWidth / 2 - 50;
				slider_mc.y = stage.stageHeight - 50;
			});
			this.addEventListener(Event.ENTER_FRAME , on3DRenderHandler);
			
		}
		private function initObject():void {
			slider_mc.liveDragging = true;
			slider_mc.addEventListener( SliderEvent.CHANGE , sliderChangeHandler);
			slider_mc.addEventListener( SliderEvent.THUMB_PRESS , sliderThumbMouseDownHandler);
			slider_mc.addEventListener( SliderEvent.THUMB_RELEASE , sliderThumbMouseDownHandler);
			slider_mc.minimum = 0;
			slider_mc.maximum = 2000;
			slider_mc.x = stage.stageWidth / 2 - 50;
			slider_mc.y = stage.stageHeight - 50;
			//slider物件的x,y座標。
			this.addChild(slider_mc);			
			stage.addEventListener(MouseEvent.MOUSE_WHEEL, onMouseWheel);
			//偵聽滾輪事件。
		}
		
		private function sliderChangeHandler(e:SliderEvent):void {
			cameraX = e.value;
		}
		
		private function sliderThumbMouseDownHandler(e:Event):void {			
			if (e.type == SliderEvent.THUMB_PRESS) {
				_isSliderMouseDown = true;				
			}else {
				_isSliderMouseDown = false;
			}	
		}
	
		private function init3DObject():void {
			var _bmpMat		:MaterialObject3D;
			var _planeHeight:int
			for (var i:int = 0; i < itemOfNumber; i++) {				
				if (i % 2 == 0) {						
					//_bmpMat = new ReflectionFileMaterial("images/" + i + ".jpg",true)
					_bmpMat = new ReflectionFileMaterial("images/" + 23 + ".jpg",true)
					_planeHeight = 250;
				}else {
					_bmpMat = new BitmapFileMaterial("images/" + 23 + ".jpg", true);
					//_bmpMat = new BitmapFileMaterial("images/" + i + ".jpg", true);
					
					_planeHeight = 125;
				}				
				_bmpMat.interactive = true;
				_bmpMat.smooth = true;				
				var _plane:Plane = new Plane(_bmpMat, 150, _planeHeight);				
				_plane.x = Math.floor( i / 2) * 200;
				_plane.extra = { id:i };
				_plane.y = i % 2 * 200;				
				_plane.addEventListener(InteractiveScene3DEvent.OBJECT_CLICK, onEvent3DClick);
				scene.addChild(_plane);
			}
		}
		private function onMouseWheel(e:MouseEvent):void {
			//滾輪事件,
			//e.dalta如果大於0,表示滾輪向上,小於0表示向下。			
			cameraZ = camera.z + (e.delta * 100);
			//將camera要移動的目標z軸寫入cameraZ變數裡。
			if (cameraZ < cameraZMin) {
				cameraZ = cameraZMin
			}else if(cameraZ > cameraZMax){
				cameraZ = cameraZMax
			}
			//判斷目標z軸是否小於最小值或是大於最大值。			
		}	
		private function onEvent3DClick(e:InteractiveScene3DEvent):void {
			moveCurrentPlane2OriginPosition();			
			_currentPlane = e.displayObject3D as Plane;
			Tweener.addTween(_currentPlane, 
			{
				z			: -PLANE_MOVE_FORWARD,
				time		: PLANE_TWEEN_TIME,
				transition	: PLANE_TRANSITION
			});
			cameraX = _currentPlane.x;			
			cameraY = (_currentPlane.extra.id % 2 == 0) ? _currentPlane.y + 80  :_currentPlane.y;
			cameraZ = -250;	
			stage.addEventListener(MouseEvent.MOUSE_UP, stageMouseUpHandler);			
		}
		private function moveCurrentPlane2OriginPosition():void {
			if (_currentPlane != null) {
				Tweener.addTween(_currentPlane, 
				{
					z			: 0,
					time		: PLANE_TWEEN_TIME,
					transition	: PLANE_TRANSITION
				});
			}
			_currentPlane = null;
		}
		private function stageMouseUpHandler(e:MouseEvent):void {
			cameraZ = CAMERA_Z_DEFAULT;
			stage.removeEventListener(MouseEvent.MOUSE_UP, stageMouseUpHandler);	
			moveCurrentPlane2OriginPosition();			
		}
		protected function on3DRenderHandler(e:Event):void {				
			var _incrementX:Number = (cameraX - camera.x) / 20;	
			var _incrementRotation:Number = (_incrementX * 2 - camera.rotationY) / 40;
			var _incrementY:Number = (cameraY - camera.y) / 20
			var _incrementZ:Number = (cameraZ - camera.z) / 20
			camera.x += _incrementX;						
			camera.rotationY += _incrementRotation;										
			camera.y += _incrementY;						
			camera.z += _incrementZ;						
			
			if (_isSliderMouseDown) {
				singleRender();
				return;	
			}
			
			if ( Math.abs(_incrementX) < MIN_VALUE &&  Math.abs(_incrementZ) < MIN_VALUE && Math.abs(_incrementY) < MIN_VALUE && Math.abs(_incrementRotation) < MIN_VALUE) {											
				return;
			}
			singleRender();
			
        }
    }
}
