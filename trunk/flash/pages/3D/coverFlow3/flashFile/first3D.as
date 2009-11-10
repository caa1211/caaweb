

package
{

	import flash.display.*;
	import flash.events.*;
	import flash.filters.BlurFilter;

	//import org.papervision3d.core.effects.view.ReflectionView;
	import org.papervision3d.view.BasicView;
	import org.papervision3d.materials.ColorMaterial;
	import org.papervision3d.objects.primitives.Plane;
	import org.papervision3d.objects.primitives.Cube;
	import caurina.transitions.Tweener;
	
	import org.papervision3d.events.InteractiveScene3DEvent;
	import org.papervision3d.objects.DisplayObject3D;
	
	import org.papervision3d.materials.utils.MaterialsList;
		import org.papervision3d.materials.BitmapFileMaterial;
	import org.papervision3d.events.*;
	//import milkmidi.papervision3d.materials.ReflectionFileMaterial;
	
	public class first3D extends MovieClip {	
		
			private var ldr:Loader;
			var cameraFlag = 0;
			
		private var view:BasicView;
		private var rootNote:DisplayObject3D;
		public function first3D():void{
			init3DEngine();
			//init3DAxis();
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

			view = new BasicView(0, 0, true, true, "Target");	
			
		/*	view.viewportReflection.filters = [new BlurFilter(2, 2, 3)];
			view.viewportReflection.alpha = .6;
			view.surfaceHeight = -400;
		*/
			
			view.viewport.buttonMode = true;
			rootNote = new DisplayObject3D();
			view.scene.addChild(rootNote);
			
			this.addChild(view);	
			this.addEventListener(Event.ENTER_FRAME, onEventRender3D);	
			//view.camera.x = 1000;
			view.camera.z = -750;
			//view.camera.x = -200;
			view.camera.y = 0;
		}

		
		
		var rotateAngle:int = 0;
		var middleOffset:int = 100;
		var interval = 300;
		var zinterval = -100;
		var zoom = 210;
		var totleItems = 7;
		var isRender = false;
		
			private function navi3DObject(id):void {
				
			var middleFix = 1;
		    var middleOffsetValue = 0;
		    targetItemIndex = id;
	        var middleFlag;
			
	        stage.quality = StageQuality.MEDIUM;
			for (var i = 1; i < totleItems+1; i++ )
			{			
		             if (i < targetItemIndex)
					 {
						 middleOffsetValue = 0;
						 middleFlag = 0;
					 }
				   else if (  i == targetItemIndex)
				    {
					middleOffsetValue = middleOffset  / 2;
					middleFlag = 1;
				    middleFix = 0;
					}
					else if ( i > targetItemIndex)
					{
				    	middleOffsetValue =middleOffset;
					    middleFix = -1;
						middleFlag = 0;
					}
					
	        var panel =  rootNote.getChildByName('plane' + i);
			   // panel.scale = 1;
				isRender = true;
				var zoomValue = zoom * middleFlag;
				Tweener.addTween(panel, {
					x : i * interval +  middleOffsetValue  -(interval * targetItemIndex + middleOffset / 2 ),
					rotationY :  rotateAngle*middleFix *-1,
					//z : (i - targetItemIndex) * zinterval * middleFix  - zoomValue,
					y : middleFlag * -150,
					time:0.8,
					//width: this.width * 1.5
					scale:  middleFlag == 1? 2: 1,
					onComplete: function():void {
						isRender = false;
						stage.quality = StageQuality.HIGH;
						}
					});
				
	
				}
			}
			
			 var targetItemIndex = 3;
			 
		private function init3DObject():void{

			var middleFix = 1;
		    var middleOffsetValue = 0;
			var zoomValue = 0;

			for (var i = 1; i < totleItems+1; i++ )
			{	
				
				
		   var _bmpMat:BitmapFileMaterial = new BitmapFileMaterial('icons/' + i + '.png', true);
			//var _bmpMat:ReflectionFileMaterial = new ReflectionFileMaterial('icons/' + i + '.png', true);
			_bmpMat.addEventListener(FileLoadEvent.LOAD_COMPLETE, onFileLoaderComplete);
			var _plane:Plane = new Plane(_bmpMat, 270, 283, 4, 4);
			//_bmpMat.doubleSided = true;
			_bmpMat.interactive = true;
			//_bmpMat.smooth = true;
			
	        /*
		             if (i < targetItemIndex)
					 {
						 middleOffsetValue = 0;
						 zoomValue = 0;
					 }
				   else if (  i == targetItemIndex)
				    {
					middleOffsetValue = middleOffset  / 2;
					zoomValue = zoom;
				    middleFix = 0;
					}
					else if ( i > targetItemIndex)
					{
				    	middleOffsetValue =middleOffset;
					    middleFix = -1;
						zoomValue = 0;
					}

			_plane.x = i * interval +  middleOffsetValue  -(interval * targetItemIndex + middleOffset / 2 );
			_plane.rotationY = rotateAngle*middleFix *-1;
			_plane.z = (i - targetItemIndex)  * zinterval * middleFix  - zoomValue;
			*/
			
			
			_plane.name = 'plane' + i;
			_plane.extra = { id:i };
			_plane.addEventListener(InteractiveScene3DEvent.OBJECT_OVER, on3DOver);
			_plane.addEventListener(InteractiveScene3DEvent.OBJECT_OUT, on3DOut);
		    _plane.addEventListener(InteractiveScene3DEvent.OBJECT_PRESS, on3DPress);
				
			_plane.useOwnContainer = true;
			rootNote.addChild(_plane);	
		
			
				}

			//navi3DObject(targetItemIndex);
			}
			
			var loadedNumber = 0;
			private function onFileLoaderComplete(e:FileLoadEvent):void
			{
					
			
				loadedNumber ++;
				
				if (loadedNumber >= totleItems)
				navi3DObject(targetItemIndex);
				
				}
			
			
			private function on3DOver(e:InteractiveScene3DEvent):void {
				if (e.displayObject3D.extra.id == targetItemIndex)
				return;
				//e.displayObject3D.scale = 1.1;
				}
			
			private function on3DOut(e:InteractiveScene3DEvent):void {	
				//e.displayObject3D.scale = 1;
				}

			
			private function on3DPress(e:InteractiveScene3DEvent):void {
				
				navi3DObject(e.displayObject3D.extra.id);
				
				}
		private function onEventRender3D(e:Event):void {	
	/*	rootNote.y = 200;
        rootNote.rotationY += 3;
		for (var i = 1; i < totleItems +1; i++ )
		rootNote.getChildByName('plane'+i).rotationY +=3
		*/
		
		//if (isRender == false)
		//return;
		
			for (var i = 1; i < totleItems+1; i++ )
		{
			var _plane = rootNote.getChildByName('plane' + i) as Plane;
			var _blur:int = _plane.screenZ / 1000;
			_plane.filters = [new BlurFilter(_blur, _blur)];
		}
		view.singleRender();

		}
	}
}

			
		