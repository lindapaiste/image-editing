import React, {Component} from 'react';

export default class AnnotatedImageEdit {
    state = {
        products: {},  //keyed by product id
        positions: [], //x,y,product id
        isSaved: false,
        activePosition: null,
    };
    addProduct( productId ) {
        if ( this.state.activePosition ) {
            this.setState( prevState => {

            })
            //load product details
        }
    }
    addDot(x,y) {
        this.setState({
            activePosition: {x, y}
        });
    }
}