/**
 * Tamron class
 *
 * @author Dmitry Monin
 */

Nb = {};

Nb.Tamron = {
    
    facebookRecommend : function()
    {
        FB.ui(
            {
                method: 'apprequests',
                message: "is currently on Tamron Island - the photographer's paradise! Why don't you join us, test the new Tamron lens and lock in a chance at winning great prizes.",
                display : 'popup'
            },
            function(e) {
                if(e)
                {
                    getFlashMovieObject('tamron-island').onFacebookRecommendationComplete();
                }
            }
        );
    }
};