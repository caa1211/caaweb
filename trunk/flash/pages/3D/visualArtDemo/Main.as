package 
{
    import flash.display.*;
   import flash.events.*;
    import flash.utils.getTimer;
    import org.papervision3d.core.proto.*;
    import org.papervision3d.lights.*;
    import org.papervision3d.materials.*;
    import org.papervision3d.materials.shadematerials.*;
    import org.papervision3d.objects.*;
    import org.papervision3d.objects.primitives.*;
    import org.papervision3d.view.BasicView;
    
    public class Main extends BasicView
   {
       // Const Vars
       static private const ROT_NUM            :uint = 15;
        static private const CHILDREN_NUM        :uint = 35;
        
        private var higes:Array = [];
        
        /**
         * Constructor
         */
        public function Main():void 
        {
            stage.quality = StageQuality.MEDIUM;
            
            var light:PointLight3D = new PointLight3D();
            
            // create 3d objects
            for (var i:int = 0; i < ROT_NUM; i++) 
            {
                var hige:DisplayObject3D = new DisplayObject3D();
                scene.addChild(hige);
                
                hige.rotationY = i * 360 / ROT_NUM;
                
                var distance:Number = 100;
                
                for (var j:int = 0; j < CHILDREN_NUM; j++) 
                {
                    var m:MaterialObject3D = new FlatShadeMaterial(light, 0xFF0000 + 0x001000 * j, 0x000000);
                    var s:Sphere = new Sphere(m, 50, 1, 1);
                    
                    s.scale = 1 - 1 / CHILDREN_NUM * j;
                    distance += 70 * s.scale;
                    s.z = distance;
                    hige.addChild(s);
                    
                    if (higes[j] == null) higes[j] = [];
                    higes[j][i] = s
                }
            }
            
            // rendering
            startRendering();
            
            // mouse interactive
            stage.addEventListener(MouseEvent.MOUSE_DOWN, onMouseDown);
            stage.addEventListener(MouseEvent.MOUSE_MOVE, onMouseMove);
            stage.addEventListener(MouseEvent.MOUSE_UP, onMouseUp);
        }
        
        /**
         * onEnterFrame
         * @param    event
         */
        override protected function onRenderTick(event:Event = null):void 
        {
            // Hige Animation
            for (var j:int = 0; j < higes.length; j++) 
            {
                for (var i:int = 0; i < higes[j].length; i++) 
                {
                    var rot:Number = getTimer() / 1000 + 100 * i;
                    higes[j][i].x = Math.sin(rot) * 30 * j
                    higes[j][i].y = Math.cos(rot) * 10 * j
                }
            }
            
            // Mouse Interactive
            easePitch += (cameraPitch - easePitch) * 0.2
            easeYaw += (cameraYaw - easeYaw) * 0.2
            camera.orbit(easePitch, easeYaw, true, cameraTarget);
            
            // render
            super.onRenderTick(event);
        }
        
        // ----------------------------------------------
        // Mouse Interactive
        // ----------------------------------------------
        
        private var isOribiting:Boolean;
        private var cameraPitch:Number = 90;
        private var cameraYaw:Number = 270;
        private var cameraTarget:DisplayObject3D = DisplayObject3D.ZERO;
        private var previousMouseX:Number;
        private var previousMouseY:Number;
        private var easePitch:Number = 90;
        private var easeYaw:Number = 270;
        
        private function onMouseDown(event:MouseEvent):void
        {
            isOribiting = true;
            previousMouseX = event.stageX;
            previousMouseY = event.stageY;
            singleRender();
        }
 
        private function onMouseUp(event:MouseEvent):void
        {
            isOribiting = false;
        }
 
        private function onMouseMove(event:MouseEvent):void
        {
            var differenceX:Number = event.stageX - previousMouseX;
            var differenceY:Number = event.stageY - previousMouseY;
 
            if(isOribiting)
            {
                cameraPitch += differenceY * 0.25;
                cameraYaw += differenceX * 0.25;
 
                cameraPitch %= 360;
 
                cameraPitch = cameraPitch > 0 ? cameraPitch : 0.0001;
                cameraPitch = cameraPitch < 180 ? cameraPitch : 179.9999;
 
                previousMouseX = event.stageX;
                previousMouseY = event.stageY;
            }
        }
    }
}