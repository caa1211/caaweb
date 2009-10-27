package milkmidi.papervision3d.materials
{
	import flash.display.BitmapData;
    import flash.display.BlendMode;
    import flash.display.DisplayObject;
    import flash.display.GradientType;
    import flash.display.Sprite;
    import flash.geom.Matrix;
	import org.papervision3d.materials.BitmapMaterial;        
	import milkmidi.utils.BitmapUtil;
    public class ReflectionMaterial extends BitmapMaterial {
        
        public function ReflectionMaterial(pTarget:*) {
			var _originBmp	:BitmapData = BitmapUtil.getBitmapData(pTarget);
			var _reflectBmp	:BitmapData = BitmapUtil.reflect( pTarget);
			var _resultBmp  :BitmapData = BitmapUtil.mergeBitmap( _originBmp , _reflectBmp);			
            super(_resultBmp , true);
        }      
		/*
        override public function drawBitmap():void {
            
            var mtx:Matrix = new Matrix();
            mtx.scale( movie.scaleX, -movie.scaleY );
            mtx.translate(0, movie.height);
            
            bitmap.draw( movie, mtx, movie.transform.colorTransform, BlendMode.LAYER );
    
            var sprite:Sprite = new Sprite();
            
            var alphas:Array = [0, .2];
            var ratios:Array = [150, 255];
            var matr:Matrix = new Matrix();
            matr.createGradientBox(bitmap.width, bitmap.height, Math.PI/2, 0, 0);
            
            sprite.graphics.beginGradientFill(GradientType.LINEAR, [0x000000, 0x000000], alphas, ratios, matr);  
            sprite.graphics.drawRect(0,0,bitmap.width,bitmap.height);
            
            bitmap.draw(sprite, mtx, null, BlendMode.ALPHA);
        }*/
        
        
    }
}