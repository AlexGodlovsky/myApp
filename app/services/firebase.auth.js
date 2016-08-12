app.provider('firebaseAuth', [function firebaseAuthProvider ($firebaseAuth){

    this.getUser = function(){

    };

    test = 'testThis'

    this.$get = function($firebaseAuth){

        return{
            user : function () {
                return firebase.auth().currentUser;
            },

            login : function(email, password){
                return firebase.auth().signInWithEmailAndPassword(email, password)
            },

            logout : function (){
                $firebaseAuth().$signOut()
            },

            registration : function(email, password){
                return firebase.auth().createUserWithEmailAndPassword(email, password);
            },

            userUid : function(){
                return firebase.auth().currentUser.uid;
            },

            waitForSignIn : $firebaseAuth().$waitForSignIn().then(function(res){
                return res
            }),

            test : function (){
                return $firebaseAuth().$getAuth()
            }
        }
    }
}]);
