

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
			
		private var view:ReflectionView;
		private var rootNote:DisplayObject3D;
		public function first3D():void{
			init3DEngine();
			init3DAxis();
			init3DObject();
			initObject();
			
	         
		}
		
		private function initObject():void {
			ldr = new Loader();
			ldr.contentLoaderInfo.addEventListener(Event.COMPLETE, onLoaderComplete);
			
			}
		
			private function onLoaderComplete(e:Event):void {
				ldr.x = stage.width / 2 - ldr.width / 2;
				ldr.y = stage.height / 2 -ldr.height / 2;
				ldr.alpha = 0;
				
				Tweener.addTween(ldr, { alpha:1, time:1 } );
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
			
			
			var bMat:ColorMaterial = new ColorMaterial(0x000000, 1);
			bMat.doubleSided = true;
			var m4:MaterialsList = new MaterialsList( { all:bMat } );
			cube = new Cube(m4, 20, 20, 20);
			cube.x = 0;
			cube.y = 0;
			cube.z = 0;
			view.scene.addChild(cube );

		}
			
			
		private function init3DEngine():void{

			view = new ReflectionView(0, 0, true, true, "Target");	
			
			view.viewportReflection.filters = [new BlurFilter(2, 2, 3)];
			view.viewportReflection.alpha = .6;
			view.surfaceHeight = -400;
			
			view.viewport.buttonMode = true;
			rootNote = new DisplayObject3D();
			view.scene.addChild(rootNote);
			
			this.addChild(view);	
			this.addEventListener(Event.ENTER_FRAME, onEventRender3D);	
			//view.camera.x = 1000;
			view.camera.z = -3500;
			//view.camera.x = 2200;
			//view.camera.y = 200;
		}

		
			private function navi3DObject(id):void {
			var rotateAngle = -60
			var totleItems = 12;
			var middleFix = 1;
			
			var middleOffset =1000;
		    var middleOffsetValue = 0;
		    targetItemIndex = id;
			var zoom = 0;
			for (var i = 1; i < totleItems+1; i++ )
			{			
		             if (i < targetItemIndex)
					 {
						 middleOffsetValue = 0;
						 zoom = 0;
					 }
				   else if (  i == targetItemIndex)
				    {
					rotateAngle = 0;
					middleOffsetValue = middleOffset  / 2;
					zoom = 2000;
					 middleFix = 0;
					}
					else if ( i > targetItemIndex)
					{
				    	middleOffsetValue =middleOffset;
						rotateAngle = 60;
					    middleFix = -1;
						zoom = 0;
					}
					
					
	        var panel =  rootNote.getChildByName('plane' + i);
			panel.scale = 1;
			//panel.z = i * -2 * middleFix  - zoom;
				Tweener.addTween(panel, {
					
					x : i * 300 +  middleOffsetValue  -(300 * targetItemIndex + middleOffset / 2 ),
					rotationY : rotateAngle,
					z : (i - targetItemIndex) * -100 * middleFix  - zoom,
					time:0.8,
					onComplete: function():void {
						//this.scale = 1;
						//trace('adfsdfa');
						//aaa++';
				//	this.z = this.extra.id * -2 * middleFix  - zoom;
						}
					});
				
			/*panel.x = i * 300 +  middleOffsetValue  -(300 * targetItemIndex + middleOffset / 2 );
			panel.rotationY = rotateAngle;
			
			panel.z = i * -2 * middleFix  - zoom;*/
	
				}
			}
			
			 var targetItemIndex = 6;
			 
		private function init3DObject():void{
            
			var rotateAngle = -60
			var totleItems = 12;
			var middleFix = 1;
			
			var middleOffset =1000;
		    var middleOffsetValue = 0;
		   
			var zoom = 0;
			for (var i = 1; i < totleItems+1; i++ )
			{	
				
		    var _bmpMat:BitmapFileMaterial = new BitmapFileMaterial('backgrounds/' + i + '.png');
			var _plane:Plane = new Plane(_bmpMat, 500, 500);
			_bmpMat.doubleSided = true;
			_bmpMat.interactive = true;
			_bmpMat.smooth = true;
			
			
		             if (i < targetItemIndex)
					 {
						 middleOffsetValue = 0;
						 zoom = 0;
					 }
				   else if (  i == targetItemIndex)
				    {
					rotateAngle = 0;
					middleOffsetValue = middleOffset  / 2;
					zoom = 2000;
					 middleFix = 0;
					}
					else if ( i > targetItemIndex)
					{
				    	middleOffsetValue =middleOffset;
						rotateAngle = 60;
					    middleFix = -1;
						zoom = 0;
					}

			_plane.x = i * 300 +  middleOffsetValue  -(300 * targetItemIndex + middleOffset / 2 );
			_plane.rotationY = rotateAngle;
			
			_plane.z = (i - targetItemIndex)  * -100 * middleFix  - zoom;
			//trace(_plane.z);
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
				
				if (e.displayObject3D.extra.id == targetItemIndex)
				return;

				e.displayObject3D.scale = 1.1;
				
				}
			
			private function on3DOut(e:InteractiveScene3DEvent):void {
				e.displayObject3D.scale = 1;
				}

			
			private function on3DPress(e:InteractiveScene3DEvent):void {
				
				navi3DObject(e.displayObject3D.extra.id);
					//var _id:int = e.displayObject3D.extra.id;
					//ldr.load(new URLRequest('backgrounds/'+_id+'.png'));
			
				
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
	/*	rootNote.y = 200;
        rootNote.rotationY += 3;
		for (var i = 1; i < 6; i++ )
		rootNote.getChildByName('plane'+i).rotationY +=3
		*/
			for (var i = 1; i < 12; i++ )
		{
			var _plane = rootNote.getChildByName('plane' + i) as Plane;
			var _blur:int = _plane.screenZ / 1000;
			_plane.filters = [new BlurFilter(_blur, _blur)];
		}
		view.singleRender();

		}
	}
}

			
		