import React, { Component } from 'react';

/**
 * MODULE 2: Functional vs Class Components, Props, State & Lifecycle Methods
 * Demonstrating a React Class Component with lifecycle methods componentDidMount & componentWillUnmount
 */

export default class LiveAdoptionCounter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      adoptedCount: 142,
      timerSeconds: 0,
    };
  }

  componentDidMount() {
    // Lifecycle demonstration: interval tick
    this.interval = setInterval(() => {
      this.setState((prevState) => ({
        timerSeconds: prevState.timerSeconds + 1,
      }));
    }, 1000);
  }

  componentWillUnmount() {
    // Cleanup on unmount
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  render() {
    const { title } = this.props;
    return (
      <div
        style={{
          background: 'linear-gradient(135deg, #0d9488, #0f766e)',
          color: 'white',
          padding: '1rem 1.5rem',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          margin: '1.5rem 0'
        }}
      >
        <div>
          <h4 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{title || 'Happy Homes Created'}</h4>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '1.8rem', fontWeight: 800 }}>{this.state.adoptedCount}+ Pets</span>
          <p style={{ fontSize: '0.75rem', opacity: 0.8 }}>Live session time: {this.state.timerSeconds}s</p>
        </div>
      </div>
    );
  }
}
