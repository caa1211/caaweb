

package
{
	import flash.display.InteractiveObject;
	import flash.display.Loader;
	import flash.display.MovieClip;
	import flash.display.*;
	import flash.events.*;
	import flash.filters.BlurFilter;
	import flash.net.URLRequest;

	import org.papervision3d.view.BasicView;
	import org.papervision3d.materials.ColorMaterial;
	import org.papervision3d.objects.primitives.Plane;

	import caurina.transitions.Tweener;
	
	import org.papervision3d.events.InteractiveScene3DEvent;
	import org.papervision3d.materials.BitmapFileMaterial;
	import org.papervision3d.objects.DisplayObject3D;
	
	import org.papervision3d.materials.utils.MaterialsList;
	
	import org.papervision3d.objects.DisplayObject3D;
	public class first3D extends MovieClip {	
		
			private var ldr:Loader;
			var cameraFlag = 0;
			var radius:int = 2000;
			var isRender:Boolean = false;
		private var view:BasicView;
		private var rootNote:DisplayObject3D;
		public function first3D():void{
			init3DEngine();
			init3DObject();
		}
		
	
			
		private function init3DEngine():void{

			view = new BasicView(0, 0, true, true, "Free");	

			view.viewport.buttonMode = true;
			rootNote = new DisplayObject3D();
			view.scene.addChild(rootNote);
			
			this.addChild(view);	
			this.addEventListener(Event.ENTER_FRAME, onEventRender3D);	
		
			//stage.addEventListener(MouseEvent.CLICK, onStageClick);
			//	view.camera.z = 5000;
		}
		
			private function onStageClick(e:MouseEvent):void {
				isRender = true;
				var _emptyObj3D:DisplayObject3D = new DisplayObject3D();
				_emptyObj3D.copyTransform(rootNote.getChildByName('plane1'))
				_emptyObj3D.moveBackward(1000);
				Tweener.addTween(view.camera, 
				{
					x: _emptyObj3D.x,
					y: _emptyObj3D.y,
					z: _emptyObj3D.z,
					rotationX: _emptyObj3D.rotationX,
					rotationY: _emptyObj3D.rotationY,
					rotationZ: _emptyObj3D.rotationZ,
	              	time:3,
				    transition:'easeOutExpo',
                    onComplete	:function ():void { isRender = false; }
					
			}
				
				);
				
					
					}


		private function init3DObject():void{

			for (var i = 1; i < 12; i++ )
			{	
		    var _bmpMat:BitmapFileMaterial = new BitmapFileMaterial('backgrounds/' + i + '.png', true);
			var _plane:Plane = new Plane(_bmpMat, 500, 500);
			_bmpMat.doubleSided = true;
			_bmpMat.interactive = true;
			_bmpMat.smooth = true;
			
			
			isRender = true;
			Tweener.addTween(_plane, 
			{
				x: Math.random() * radius - radius / 2,
				y: Math.random() * radius - radius / 2,
				z: Math.random() * radius - radius / 2,
				rotationX:Math.random() * 360,
				rotationY:Math.random() * 360,
				rotationZ:Math.random() * 360,
				time:3,
				transition:'easeOutExpo',
				delay: i * 0.02,
				onComplete	:function ():void { isRender = false; }
			}
			
			);
			
			
			//_plane.x = 600;
			_plane.name = 'plane' + i;
			_plane.extra = { id:i };
			//_plane.addEventListener(InteractiveScene3DEvent.OBJECT_OVER, on3DOver);
			//_plane.addEventListener(InteractiveScene3DEvent.OBJECT_OUT, on3DOut);
			
		    _plane.addEventListener(InteractiveScene3DEvent.OBJECT_PRESS, on3DPress);
				
			_plane.useOwnContainer = true;
			rootNote.addChild(_plane);		
				}

		
			}
			
			private function on3DOver(e:InteractiveScene3DEvent):void {
				e.displayObject3D.scale = 1.2;
				
				}
			
			private function on3DOut(e:InteractiveScene3DEvent):void {
				e.displayObject3D.scale = 1;
				}

			
			private function on3DPress(e:InteractiveScene3DEvent):void {
				var _emptyObj3D:DisplayObject3D = new DisplayObject3D();
				_emptyObj3D.copyTransform(e.displayObject3D);
				_emptyObj3D.moveBackward(600);
				
				
				isRender = true;
				Tweener.addTween(view.camera, 
				{
					x: _emptyObj3D.x,
					y: _emptyObj3D.y,
					z: _emptyObj3D.z,
					rotationX: _emptyObj3D.rotationX,
					rotationY: _emptyObj3D.rotationY,
					rotationZ: _emptyObj3D.rotationZ,
	              	time:3,
				    transition:'easeOutExpo',
                    onComplete	:function ():void { isRender = false; }
					}
				
				);
				
				e.stopPropagation();
		
		
				}
		private function onEventRender3D(e:Event):void {	
	
			//	if (!isRender)
			//return;
			
		/*	for (var i = 1; i < 12; i++ )
		{
			var _plane = rootNote.getChildByName('plane' + i) as Plane;
			var _blur:int = _plane.screenZ / 1000;
			_plane.filters = [new BlurFilter(_blur, _blur)];
		}*/
		view.singleRender();

		}
	}
}

			
		