

package
{
	import flash.display.InteractiveObject;
	import flash.display.Loader;
	import flash.display.MovieClip;
	import flash.display.*;
	import flash.events.*;
	import flash.filters.BlurFilter;
	import flash.net.URLRequest;
	import org.papervision3d.core.effects.view.ReflectionView;
	import org.papervision3d.view.BasicView;
	import org.papervision3d.materials.ColorMaterial;
	import org.papervision3d.objects.primitives.Plane;
	import org.papervision3d.objects.primitives.Cube;
	import caurina.transitions.Tweener;
	
	import org.papervision3d.events.InteractiveScene3DEvent;
	import org.papervision3d.materials.BitmapFileMaterial;
	import org.papervision3d.objects.DisplayObject3D;
	
	import org.papervision3d.materials.utils.MaterialsList;
	
	import org.papervision3d.objects.DisplayObject3D;
	public class first3D extends MovieClip {	
		
			private var ldr:Loader;
			var cameraFlag = 0;
			var isRender = true;
		private var view:ReflectionView;
		private var rootNote:DisplayObject3D;
		public function first3D():void{
			init3DEngine();
			//init3DAxis();
			init3DObject();
			initObject();
			
	         
		}
		
		private var currentIndex = 0;
					var itemsSize:int = 12
            var radius:Number  = 1300;
			private var angleUnit :Number = (Math.PI * 2 / itemsSize);
			
			
		private function initObject():void {
			ldr = new Loader();
			ldr.contentLoaderInfo.addEventListener(Event.COMPLETE, onLoaderComplete);

		
			rightBtn.buttonMode = true;
			leftBtn.buttonMode = true;
			rightBtn.addEventListener(MouseEvent.CLICK, onButtonClick);
			leftBtn.addEventListener(MouseEvent.CLICK, onButtonClick);
			
			this.addChild(rightBtn);
			this.addChild(leftBtn);
			}
		
			private function onButtonClick(e:MouseEvent):void {
			if (e.currentTarget == rightBtn)
			{
				currentIndex++;
				}
				else
				currentIndex--
				
				updateRootNodeTranform();
			}
			
			private function updateRootNodeTranform():void {
				
				//Tweener.addTween(rootNote, { rotationY: currentIndex * angleUnit * 180 / Math.PI, time:0.5 } );
				isRender = true;
				Tweener.addTween(rootNote, 
				{ 
			    rotationY: currentIndex * angleUnit * 180 / Math.PI, time:0.5, 
				onComplete	:function ():void { stage.quality = StageQuality.HIGH; isRender = false; }}
				);
				
				}
				
				
			private function onLoaderComplete(e:Event):void {
				ldr.x = stage.width / 2 - ldr.width / 2;
				ldr.y = stage.height / 2 -ldr.height / 2;
				ldr.alpha = 0;
				
				isRender = true;
				Tweener.addTween(ldr, 
				{ 
				alpha:1, 
				time:1 , 
				onComplete	:function ():void { stage.quality = StageQuality.HIGH; isRender = false; }}
				);
				
				this.addChild(ldr);
				stage.addEventListener(MouseEvent.CLICK, onStageClick);
				}
			
				
				
				private function onStageClick(e:MouseEvent):void {
					
				ldr.unload();
					stage.removeEventListener(MouseEvent.CLICK, onStageClick);
					
					}
					
					
					
		private function init3DAxis():void {
			var cube:Cube;
			
			var yMat:ColorMaterial = new ColorMaterial(0x00ff00, 1);
			yMat.doubleSided = true;
			var ml:MaterialsList = new MaterialsList( { all:yMat } );
			cube = new Cube(ml, 20, 20, 300);
			cube.y = 140;
			view.scene.addChild(cube );
				
			var zMat:ColorMaterial = new ColorMaterial(0x0000ff, 1);
			zMat.doubleSided = true;
			var m2:MaterialsList = new MaterialsList( { all:zMat } );	
			cube = new Cube(m2, 20, 300, 20);	
			cube.z = 140;
			view.scene.addChild(cube );
			
			var xMat:ColorMaterial = new ColorMaterial(0xff0000, 1);
			xMat.doubleSided = true;
			
			var m3:MaterialsList = new MaterialsList( { all:xMat } );	
			cube = new Cube(m3, 300, 20, 20);	
			cube.x = 140;
			view.scene.addChild(cube );
			
			
		}
			
			
		private function init3DEngine():void{

			view = new ReflectionView(0, 0, true, true, "Target");	
			
			view.viewportReflection.filters = [new BlurFilter(2, 2, 5)];
			view.viewportReflection.alpha = .8;
			view.surfaceHeight = -500;
			
			view.viewport.buttonMode = true;
			rootNote = new DisplayObject3D();
			view.scene.addChild(rootNote);
			
			this.addChild(view);	
			this.addEventListener(Event.ENTER_FRAME, onEventRender3D);	
			//view.camera.x = 1000;
			view.camera.z = 3000;
			view.camera.x = 0;
			view.camera.y = 600;
		}


			
		private function init3DObject():void {

			for (var i = 1; i <= itemsSize; i++ )
			{	
		    var _bmpMat:BitmapFileMaterial = new BitmapFileMaterial('backgrounds/' + i + '.png');
			var _plane:Plane = new Plane(_bmpMat, 500, 500);
			_bmpMat.doubleSided = true;
			_bmpMat.interactive = true;
			_bmpMat.smooth = true;
			
			_plane.x = Math.cos(angleUnit * i)*radius;
			_plane.z = Math.sin(angleUnit * i)*radius;
			_plane.rotationY = 90 - (angleUnit * i) * (180 / Math.PI);
			
			//_plane.z = -i * 450 +1500;
			//_plane.x = 600;
			
			
			_plane.name = 'plane' + i;
			_plane.extra = { id:i };
			_plane.addEventListener(InteractiveScene3DEvent.OBJECT_OVER, on3DOver);
			_plane.addEventListener(InteractiveScene3DEvent.OBJECT_OUT, on3DOut);
			
		_plane.addEventListener(InteractiveScene3DEvent.OBJECT_PRESS, on3DPress);
				
			_plane.useOwnContainer = true;
			rootNote.addChild(_plane);		
				}

		
			}
			
			private function on3DOver(e:InteractiveScene3DEvent):void {
				//e.displayObject3D.scale = 1.2;
				
				isRender = true;
				Tweener.addTween(e.displayObject3D, 
				{ 
				scale : 1.2,
				time:0.3 , 
				onComplete	:function ():void { stage.quality = StageQuality.HIGH; isRender = false; }}
				);
				
	
				}
			
			private function on3DOut(e:InteractiveScene3DEvent):void {
			//	e.displayObject3D.scale = 1;
			
			isRender = true;
				Tweener.addTween(e.displayObject3D, 
				{ 
				scale : 1,
				time:0.3 , 
				onComplete	:function ():void { stage.quality = StageQuality.HIGH; isRender = false; }}
				);
				
				}

			
			private function on3DPress(e:InteractiveScene3DEvent):void {
				
					var _id:int = e.displayObject3D.extra.id;
					ldr.load(new URLRequest('backgrounds/'+_id+'.png'));
			
				
				/*
				var naviX:int = 1000;
				var naviY:int = 1000;
				if (cameraFlag == 0)
				{
					naviX = 1000;
					naviY = 1000;
					
					cameraFlag = 1;
					}
					else		
					{
					naviX = 0;
					naviY = 0;
					cameraFlag = 0;
						}
					
					Tweener.addTween(view.camera, {
					x:naviX,
					y: naviY, 
					time:2
					})
					*/
				}
		private function onEventRender3D(e:Event):void {	
			if (!isRender)
			return;
	/*	rootNote.y = 200;
        rootNote.rotationY += 3;
		for (var i = 1; i < 6; i++ )
		rootNote.getChildByName('plane'+i).rotationY +=3
		*/
			for (var i = 1; i <=itemsSize; i++ )
		{
			var _plane = rootNote.getChildByName('plane' + i) as Plane;
			var _blur:int = _plane.screenZ / 500;
			_plane.filters = [new BlurFilter(_blur, _blur)];
		}
		
		
		view.singleRender();

		}
	}
}

			
		