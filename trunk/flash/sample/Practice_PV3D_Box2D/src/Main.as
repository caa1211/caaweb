package {
	import Box2D.Collision.Shapes.b2CircleDef;
	import Box2D.Collision.Shapes.b2PolygonDef;
	import Box2D.Collision.Shapes.b2Shape;
	import Box2D.Collision.b2AABB;
	import Box2D.Common.Math.b2Vec2;
	import Box2D.Dynamics.Joints.b2Joint;
	import Box2D.Dynamics.Joints.b2MouseJoint;
	import Box2D.Dynamics.Joints.b2MouseJointDef;
	import Box2D.Dynamics.Joints.b2RevoluteJointDef;
	import Box2D.Dynamics.b2Body;
	import Box2D.Dynamics.b2BodyDef;
	import Box2D.Dynamics.b2DebugDraw;
	import Box2D.Dynamics.b2World;
	
	import flash.display.DisplayObject;
	import flash.display.SimpleButton;
	import flash.display.Sprite;
	import flash.display.StageQuality;
	import flash.events.Event;
	import flash.events.MouseEvent;
	import flash.net.URLRequest;
	import flash.net.navigateToURL;
	
	import org.papervision3d.cameras.CameraType;
	import org.papervision3d.core.utils.Mouse3D;
	import org.papervision3d.events.InteractiveScene3DEvent;
	import org.papervision3d.lights.PointLight3D;
	import org.papervision3d.materials.ColorMaterial;
	import org.papervision3d.materials.shadematerials.FlatShadeMaterial;
	import org.papervision3d.materials.utils.MaterialsList;
	import org.papervision3d.objects.DisplayObject3D;
	import org.papervision3d.objects.primitives.Cube;
	import org.papervision3d.objects.primitives.Plane;
	import org.papervision3d.objects.primitives.Sphere;
	import org.papervision3d.view.BasicView;
	
		
	/**
	 * 
	 * @author GD
	 * 
	 */	
	[SWF (width = "950", height = "500", frameRate = "30", backgroundColor = "0xFFFFFF")] 
	public class Main extends BasicView
	{
		private static const BODY_DENSITY:Number = 1.0;
		private static const BODY_FRICTION:Number = .4;
		private static const BODY_RESTITUTION:Number = .1;
		private static const WORLD_SCALE:Number = 30;
		private static const WORLD_WIDTH:Number = 950;
		private static const WORLD_HEIGHT:Number = 500;
		
		private var boxWorld:b2World;
		
		private var currentBody:b2Body;
		private var mouseJoint:b2MouseJoint;
		private var mouse3D:Mouse3D;
		private var light:PointLight3D = new PointLight3D();
		private var container:DisplayObject3D = new DisplayObject3D();
		
		[Embed (source="assets/logoBlack.png")]
		private var logoClass:Class;
		
		public function Main()
		{
			super(WORLD_WIDTH, WORLD_HEIGHT, false, true, CameraType.FREE);
			
			stage.quality = StageQuality.MEDIUM;
			Mouse3D.enabled = true;
			mouse3D = viewport.interactiveSceneManager.mouse3D;
			scene.addChild(container);
			
			initPV3D();
			initB2World();
			
			createGround();
			createBackWall();
			createDoll(1);
			
			stage.addEventListener(MouseEvent.MOUSE_UP, mouseupHandler);
			
			
			startRendering();
			debugDraw();
			addLogo();
		}
		
		private function addLogo():void
		{
			var logo:DisplayObject = DisplayObject(new logoClass());
			var button:SimpleButton = new SimpleButton();
			button.upState = logo;
			button.overState = logo;
			button.downState = logo;
			button.hitTestState = logo;
			button.useHandCursor = true;
			button.addEventListener(MouseEvent.CLICK, function(event:MouseEvent):void
			{
				navigateToURL(new URLRequest("http://waterxbread.blogspot.com/"), "_blank");
			});
			button.x = button.y = 10;
			this.addChild(button);
		}
		
		private function initPV3D():void
		{
			light.y = 1000;
			light.z = -500;
						
			camera.z = -380;
			camera.y = -160;
			camera.rotationX = 25;
		}
		
		public function initB2World():void
		{
			var worldAABB:b2AABB = new b2AABB();
			var gravity:b2Vec2 = new b2Vec2(0.0, 20.0);
			var doSleep:Boolean = true;
			
			worldAABB.upperBound.Set(100.0, 100.0);
			worldAABB.lowerBound.Set(-100.0, -100.0);

			//create world
			boxWorld = new b2World(worldAABB, gravity, doSleep);
		}
		
		override protected function onRenderTick(event:Event=null):void
		{
			super.onRenderTick(event);
			
			//box2d演算
			boxWorld.Step(1.0 / WORLD_SCALE, 10);
			
			//將演算結果套用到顯示物件
			for (var bb:b2Body = boxWorld.m_bodyList; bb; bb = bb.m_next)
			{
				if (bb.m_userData is DisplayObject3D)
				{
					bb.m_userData.x = bb.GetPosition().x * WORLD_SCALE - WORLD_WIDTH / 2;
					bb.m_userData.y = -bb.GetPosition().y * WORLD_SCALE - WORLD_HEIGHT / 2;
					bb.m_userData.rotationZ = -bb.GetAngle() * (180 / Math.PI);
				}
			}
		}
		
		protected function debugDraw():void
		{
			var dbgDraw:b2DebugDraw = new b2DebugDraw();
			
			dbgDraw.m_sprite = new Sprite();
			
			//1 meter = 30 pixel 所以放大30倍			
			dbgDraw.m_drawScale = 30.0;
			dbgDraw.m_fillAlpha = 0.8;
			dbgDraw.m_lineThickness = 1.0;
			//繪圖部分
			dbgDraw.SetFlags(b2DebugDraw.e_shapeBit);
			dbgDraw.AppendFlags(b2DebugDraw.e_jointBit);
			dbgDraw.m_sprite.x = 10;
			dbgDraw.m_sprite.y = 10;
			dbgDraw.m_sprite.scaleX = dbgDraw.m_sprite.scaleY = .25; 
			
			boxWorld.SetDebugDraw(dbgDraw);
			this.addChild(dbgDraw.m_sprite);
		}
		
		private function mousePressHandler(event:InteractiveScene3DEvent):void
		{
			if (!mouseJoint)
			{
				var mjDef:b2MouseJointDef = new b2MouseJointDef();
				var bb:b2Body = boxWorld.m_bodyList;
				
				currentBody = getBodyAtMouse();
				
				if (currentBody)
				{
					var currentX:Number = (mouse3D.x + WORLD_WIDTH / 2) / WORLD_SCALE;
					var currentY:Number = -((mouse3D.y + WORLD_HEIGHT / 2) / WORLD_SCALE);
					
					mjDef.body1 = boxWorld.GetGroundBody();
					mjDef.body2 = currentBody;
					mjDef.target.Set(currentX, currentY);
					mjDef.maxForce = 300 * currentBody.GetMass();
					mjDef.timeStep = 1.0 / WORLD_SCALE;
					
					mouseJoint = boxWorld.CreateJoint(mjDef) as b2MouseJoint;
					currentBody.WakeUp();
					
					stage.addEventListener(MouseEvent.MOUSE_MOVE, mousemoveHandler);				
				}
			}
		}
		
		
		private function mouseupHandler(event:MouseEvent):void
		{
			if (mouseJoint)
			{
				stage.removeEventListener(MouseEvent.MOUSE_MOVE, mousemoveHandler);
				boxWorld.DestroyJoint(mouseJoint);
				
				mouseJoint = null;
			}
		}
		
		private function mousemoveHandler(event:MouseEvent):void
		{			
			var currentX:Number = (mouse3D.x + WORLD_WIDTH / 2) / WORLD_SCALE;
			var currentY:Number = -((mouse3D.y + WORLD_HEIGHT / 2) / WORLD_SCALE);
			mouseJoint.SetTarget(new b2Vec2(currentX, currentY));
		}

		public function getBodyAtMouse():b2Body
		{
			var aabb:b2AABB = new b2AABB();
			var currentX:Number = (mouse3D.x + WORLD_WIDTH / 2) / WORLD_SCALE;
			var currentY:Number = -((mouse3D.y + WORLD_HEIGHT / 2) / WORLD_SCALE);
			
			aabb.lowerBound.Set(currentX - 0.001, currentY - 0.001);
			aabb.upperBound.Set(currentX + 0.001, currentY + 0.001);
			
			var k_maxCount:int = 10;
			var shapes:Array = [];
			var count:int = boxWorld.Query(aabb, shapes, k_maxCount);
			var body:b2Body = null;
			for (var i:int = 0; i < count; ++i)
			{
				if (!shapes[i].GetBody().IsStatic())
				{
					var tShape:b2Shape = shapes[i] as b2Shape;
					body = tShape.GetBody();
					break;
				}
			}
			return body;
		}
		
		private function createGround():void
		{
			var colorMat:ColorMaterial = new ColorMaterial(0x2E3192, .75);
 			var floor3D:Cube = new Cube(new MaterialsList({all:colorMat}), WORLD_WIDTH, 70, 50);
 			var wallR:Cube = new Cube(new MaterialsList({all:colorMat}), 50, 70, WORLD_HEIGHT);
			var wallL:Cube = new Cube(new MaterialsList({all:colorMat}), 50, 70, WORLD_HEIGHT);
 			
 			createPolygonBody(WORLD_WIDTH / 2, WORLD_HEIGHT, WORLD_WIDTH, 50, floor3D, true);
 			createPolygonBody(0, WORLD_HEIGHT / 2, 50, WORLD_HEIGHT, wallR, true);
			createPolygonBody(WORLD_WIDTH, WORLD_HEIGHT / 2, 50, WORLD_HEIGHT, wallL, true);
 			
			scene.addChild(floor3D);
			container.addChild(wallR);
			container.addChild(wallL);
		}
		
		private function createBackWall():void
		{
			//內來反查mouse3D座標用，不顯示
			var colorMat:ColorMaterial = new ColorMaterial(0x00FFFF, 0);
			colorMat.interactive = true;
			
			var wall:Plane = new Plane(colorMat, WORLD_WIDTH, WORLD_HEIGHT);
			wall.z = 35;
			wall.x = 0;
			wall.y = -WORLD_HEIGHT;
			
			container.addChild(wall);
		}
		
		public function createDoll(num:uint):void
		{
			var flatMat:FlatShadeMaterial = new FlatShadeMaterial(light, 0x888888, 0x000000);
			var matList:MaterialsList = new MaterialsList({all:flatMat});
			
			flatMat.fillAlpha = 1;
			
			flatMat.interactive = true;
			
			for (var i:int = 0; i < num; i++)
			{
				var startX:Number = 500;
				var startY:Number = -300 + -100 * i;
				
				//create body
				var head:b2Body = createCircleBody(startX, startY, 35, new Sphere(flatMat, 35));
				var torso1:b2Body = createPolygonBody(startX, (startY + 55), 60, 40, new Cube(matList, 60, 30, 40))
				var torso2:b2Body = createPolygonBody(startX, (startY + 55 + 40 - 10), 60, 40, new Cube(matList, 60, 30, 40));
				var torso3:b2Body = createPolygonBody(startX, (startY + 95 + 40 - 20), 60, 40, new Cube(matList, 60, 30, 40));
				var upperArmL:b2Body = createPolygonBody((startX - 60), (startY + 45), 60, 20, new Cube(matList, 60, 10, 20));
				var upperArmR:b2Body = createPolygonBody((startX + 60), (startY + 45), 60, 20, new Cube(matList, 60, 10, 20));
				var upperHandL:b2Body = createPolygonBody((startX - 110 + 5), (startY + 45), 40, 20, new Cube(matList, 40, 10, 20));
				var upperHandR:b2Body = createPolygonBody((startX + 110 - 5), (startY + 45), 40, 20, new Cube(matList, 40, 10, 20));
				var lowerArmL:b2Body = createPolygonBody((startX - 15), (startY + 95 + 70 - 10), 30, 60, new Cube(matList, 30, 10, 60));
				var lowerArmR:b2Body = createPolygonBody((startX + 15), (startY + 95 + 70 - 10), 30, 60, new Cube(matList, 30, 10, 60));
				var lowerLegL:b2Body = createPolygonBody((startX - 15), (startY + 165 + 60 - 20), 30, 60, new Cube(matList, 30, 10, 60));
				var lowerLegR:b2Body = createPolygonBody((startX + 15), (startY + 165 + 60 - 20), 30, 60, new Cube(matList, 30, 10, 60));				
				
				//create joint
				createRevoluteJoint(head, torso1, startX, (startY + 55 - 15), -40, 40);
				createRevoluteJoint(torso1, torso2, startX, (startY + 85 - 15), -15, 15);
				createRevoluteJoint(torso2, torso3, startX, (startY + 115 - 15), -15, 15);
				createRevoluteJoint(torso1, upperArmL, (startX - 30 - 10), (startY + 45), -90, 60);
				createRevoluteJoint(torso1, upperArmR, (startX + 30 + 10), (startY + 45), -60, 90);
				createRevoluteJoint(upperArmL, upperHandL, (startX - 90), (startY + 45), -90, 0);
				createRevoluteJoint(upperArmR, upperHandR, (startX + 90), (startY + 45), 0, 90);
				createRevoluteJoint(torso3, lowerArmL, (startX - 15), (startY + 95 + 70 - 30), -45, 80);
				createRevoluteJoint(torso3, lowerArmR, (startX + 15), (startY + 95 + 70 - 30), -80, 45);
				createRevoluteJoint(lowerArmL, lowerLegL, (startX - 15), (startY + 165 + 60 - 40), -90, 0);
				createRevoluteJoint(lowerArmR, lowerLegR, (startX + 15), (startY + 165 + 60 - 40), -0, 90);
				
			}
			//加入場景，註冊事件
			for (var bb:b2Body = boxWorld.m_bodyList; bb; bb = bb.m_next)
			{
				var obj3D:DisplayObject3D = bb.m_userData as DisplayObject3D;
				if (obj3D)
				{
					obj3D.addEventListener(InteractiveScene3DEvent.OBJECT_PRESS, mousePressHandler);
					container.addChild(obj3D);
				}
			}
		}

 		protected function createCircleBody(posX:int, posY:int, radius:uint, setData:Object, isFix:Boolean = false):b2Body
		{
			var body:b2Body = null
			var bodyDef:b2BodyDef = new b2BodyDef();
			var shape:b2CircleDef = new b2CircleDef();
			var meterRadius:Number = radius / WORLD_SCALE;
			var meterPosX:Number = posX / WORLD_SCALE;
			var meterPosY:Number = posY / WORLD_SCALE;
			
			shape.radius = meterRadius;

			shape.density = (!isFix) ? BODY_DENSITY : 0;
			shape.friction = BODY_FRICTION;
			shape.restitution = BODY_RESTITUTION;
			
			//set bodyDef
			bodyDef.userData = setData;
			
			bodyDef.position.Set(meterPosX, meterPosY);
			
			//set body
			body = boxWorld.CreateBody(bodyDef);
			body.CreateShape(shape);
			body.SetMassFromShapes();
			
			return body;
		} 
		
		protected function createPolygonBody(posX:int, posY:int, bWidth:uint, bHeight:uint, userData:Object, isFix:Boolean = false):b2Body
		{
			var body:b2Body = null;
			var bodyDef:b2BodyDef = new b2BodyDef();
			var shape:b2PolygonDef = new b2PolygonDef();
			var meterWidth:Number = bWidth / WORLD_SCALE;
			var meterHeight:Number = bHeight / WORLD_SCALE;
			var meterPosX:Number = posX / WORLD_SCALE;
			var meterPosY:Number = posY / WORLD_SCALE;
			
			//set shapeDef						
			shape.SetAsBox(meterWidth / 2, meterHeight / 2);
			
			//密度（kg/m^2），0時不受環境重力影響
			shape.density = (!isFix) ? BODY_DENSITY : 0;
			shape.friction = BODY_FRICTION;
			shape.restitution = BODY_RESTITUTION;
			
			//set bodyDef
			bodyDef.userData = userData;
			
			bodyDef.position.Set(meterPosX, meterPosY);
						
			//set body
			body = boxWorld.CreateBody(bodyDef);
			body.CreateShape(shape);
			body.SetMassFromShapes();
			
			return body;
		}
		
		protected function createRevoluteJoint(body1:b2Body, body2:b2Body, anchorX:Number, anchorY:Number, minAngle:Number, maxAngle:Number):b2Joint
		{
			var jointDef:b2RevoluteJointDef = new b2RevoluteJointDef();
			var joint:b2Joint = null;
			var meterY:Number = anchorY / WORLD_SCALE;
			var meterX:Number = anchorX / WORLD_SCALE;
			
			jointDef.enableLimit = true;
							
			jointDef.lowerAngle = minAngle / (180/Math.PI);
			jointDef.upperAngle = maxAngle / (180/Math.PI);
			
			jointDef.Initialize(body1, body2, new b2Vec2(meterX, meterY));
			joint = boxWorld.CreateJoint(jointDef);
			
			return joint;
		}
		
	}
}
