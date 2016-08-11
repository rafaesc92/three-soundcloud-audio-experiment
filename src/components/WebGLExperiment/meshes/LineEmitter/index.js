import Line from './Line';

class LineEmitter extends THREE.Group {

  constructor( config, resources ) {

    super();

    this.config = config;
    this.resources = resources;

    this.particlesNumber = 300;

    this.poolIndex = 0;
    this.pool = [];
    this.particles = [];

    this.populate();
    this.throw( 50 );
  }

  populate() {

    for (let i = 0; i < this.particlesNumber; i++ ) {
      this.pool.push( new Line( this.config, this.resources ) );
    }
  }

  throw( number ) {

    for (let i = 0; i < number; i++) {

      const p = this.takeFromPool();

      p.reset();

      this.particles.push( p );
      this.add( p.mesh );
    }
  }

  takeFromPool() {

    this.poolIndex = (this.poolIndex >= this.pool.length - 1) ? 0 : this.poolIndex + 1;

    return this.pool[ this.poolIndex ];
  }

  handleWindowResize({ width, height }) {

    for (let i = 0; i < this.particles.length; i++) {
      this.particles[ i ].matManager.handleWindowResize({ width, height });
    }
  }

  update( time, audioData ) {

    for (let i = 0; i < this.particles.length; i++) {
      const deadP = [];
      if( this.particles[ i ].isAlive ) {
        this.particles[ i ].update( time, audioData, i );
      } else {
        deadP.push( i );
      }

      for (let i = 0; i < deadP.length; i++) {
        this.remove( this.particles[ deadP[ i ] ]);
        this.particles.splice( deadP[ i ], 1);
        this.throw( 1 );
      }
    }
  }


}

export default LineEmitter;
