// 
 const animals=[ 'собака', 'кошка', 'тушкан', 'собака', 'собака', 'тушкан' ];

    let count={}; // ключ - животное, значение - сколько раз оно встретилось

    for ( let i=0; i<animals.length; i++ ) {
        const animal=animals[i];
        
        if ( !(animal in count) )
            count[animal]=0;
        count[animal]++;
    }

    console.log( count );