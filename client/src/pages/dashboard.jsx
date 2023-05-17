import React, { useEffect, useRef } from 'react';
import { UserList } from "../components";
import { profile, VerditerFlycatcher } from "../images";
import "../styles/dashboard.css";
import { Chart, CategoryScale, LinearScale, BarController, BarElement } from 'chart.js';


function Dashboard() {
  const chartRef1 = useRef(null);
  const chartRef2 = useRef(null);
  let chartInstance1 = null;
  let chartInstance2 = null;

  const createChart = (canvasRef, type, data, options) => {
    Chart.register(CategoryScale, LinearScale, BarController, BarElement);
    return new Chart(canvasRef, {
      type: type,
      data: data,
      options: options,
    });
  };

  const createCharts = () => {
    const chart1 = createChart(chartRef1.current, 'bar', {
      labels: ['Mongar', 'Bumthang', 'Thimphu', 'Trongsa', 'Gasa', 'Paro', 'Tashigang'],
      datasets: [{
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3, 20],
        borderWidth: 1,
        backgroundColor: 'rgba(128, 128, 128, 0.6)',
      }],
  });

  const chart2 = createChart(chartRef2.current, 'bar', {
    labels: ['Mongar', 'Bumthang', 'Thimphu', 'Trongsa', 'Gasa', 'Paro', 'Tashigang'],
    datasets: [{
      label: '# of Votes',
       data: [12, 19, 3, 5, 2, 3, 20],
      borderWidth: 1,
      backgroundColor: 'rgba(19, 109, 102, 1)',
    }],
  });

    chartInstance1 = chart1;
    chartInstance2 = chart2;
  };

  const destroyCharts = () => {
    if (chartInstance1) {
      chartInstance1.destroy();
      chartInstance1 = null;
    }
    if (chartInstance2) {
      chartInstance2.destroy();
      chartInstance2 = null;
      }
  };

  const handleResize = () => {
    destroyCharts();
    createCharts();
  };

  useEffect(() => {
    createCharts();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      destroyCharts();
    };
  }, []);

  return (
    <div> <br></br>
      <h2>Dashboard</h2> <br></br>
      <div class="mainn-content">
          <div class="dashboard-cards">
            <div class="card-single">
              <div>
                <span>Entries</span>
                <h1>766</h1>
              </div>
              <div>
                <span className="material-icons">login</span>
              </div>
            </div>
            <div class="card-single">
              <div>
                <span>Species</span>
                <h1>766</h1>
              </div>
              <div>
                <span className="material-icons">flutter_dash</span>
              </div>
            </div>
            <div class="card-single">
              <div>
                <span>Checklists</span>
                <h1>546</h1>
              </div>
              <div>
                <span className="material-icons">fact_check</span>
              </div>
            </div>
            <div class="card-single">
              <div>
                <span>Birding sites</span>
                <h1>546</h1>
              </div>
              <div>
                <span className="material-icons">language</span>
              </div>
            </div>
            <div class="card-single">
              <div>
                <span>eBirders</span>
                <h1>5,732</h1>
              </div>
              <div>
                <span className="material-icons">groups</span>
              </div>
            </div>
          </div>
          <div className="graphBox">
              <div className="box">
                <div className='grid-item'>
                  <h3>Species Leader</h3> 
                  <span>Current Month</span>
                </div>
                <div class="percentage-container">
                  <div class="percentage-value">1494</div>
                  <span className="up-arrow-icon">
                    <span className="material-icons">arrow_upward</span>
                  </span> 
                  <div class="percentage-change">0.8%</div>
                  <div class="comparison-text">than last month</div>
                </div>
                <canvas ref={chartRef1}/>
              </div>
              <div className='box'>
                <div className='grid-item'>
                  <h3>Checklists Leader</h3> 
                  <span>Current Month</span>
                </div>
                <div class="percentage-container">
                  <div class="percentage-value">1494</div>
                  <span className="up-arrow-icon">
                    <span className="material-icons">arrow_upward</span>
                  </span> 
                  <div class="percentage-change">0.8%</div>
                  <div class="comparison-text">than last month</div>
                </div>
                <canvas ref={chartRef2}/>
              </div>
          </div>
          <div class="recent-grid">
            <div class="top-eBirders">
              <div class="card">
                <div class="card-header">
                  <h3>Top eBirders</h3>
                  <button>View all</button>
                </div>
                <div class="card-body">
                  <div class="eBirder">
                    <div class="info">
                      <img src={profile} class="birders-pic"/>
                      <div>
                        <h4>Tshering Dorji</h4>
                        <small>Top Users</small>
                      </div>
                    </div>
                    <div class="more-info">
                      <span className="material-icons">more_vert</span>
                    </div>
                  </div>
                  <div class="eBirder">
                    <div class="info">
                      <img src={profile} class="birders-pic"/>
                      <div>
                        <h4>Tshering Dorji</h4>
                        <small>Top Users</small>
                      </div>
                    </div>
                    <div class="more-info">
                      <span className="material-icons">more_vert</span>
                    </div>
                  </div>
                  <div class="eBirder">
                    <div class="info">
                      <img src={profile} class="birders-pic"/>
                      <div>
                        <h4>Tshering Dorji</h4>
                        <small>Top Users</small>
                      </div>
                    </div>
                    <div class="more-info">
                      <span className="material-icons">more_vert</span>
                    </div>
                  </div>
                  <div class="eBirder">
                    <div class="info">
                      <img src={profile} class="birders-pic"/>
                      <div>
                        <h4>Tshering Dorji</h4>
                        <small>Top Users</small>
                      </div>
                    </div>
                    <div class="more-info">
                      <span className="material-icons">more_vert</span>
                    </div>
                  </div>
                  <div class="eBirder">
                    <div class="info">
                      <img src={profile} class="birders-pic"/>
                      <div>
                        <h4>Tshering Dorji</h4>
                        <small>Top Users</small>
                      </div>
                    </div>
                    <div class="more-info">
                      <span className="material-icons">more_vert</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="latest-sights">
              <div class="card">
                <div class="card-header">
                  <h3>Latest Sightings</h3>
                  <span className="material-icons">arrow_forward</span>
                </div>
                <div class="card-body">
                  <div class="eBirder">
                    <div class="info">
                      <img src={VerditerFlycatcher} class="bird-pic"/>
                      <div>
                        <h4>Macaw</h4>
                        <small>Thrumshingla, Mongar</small>
                      </div>
                    </div>
                    <div class="sighting-date">
                      <span>12 Mar 2023</span>
                    </div>
                  </div>
                  <div class="eBirder">
                    <div class="info">
                      <img src={VerditerFlycatcher} class="bird-pic"/>
                      <div>
                        <h4>Macaw</h4>
                        <small>Thrumshingla, Mongar</small>
                      </div>
                    </div>
                    <div class="sighting-date">
                      <span>12 Mar 2023</span>
                    </div>
                  </div>
                  <div class="eBirder">
                    <div class="info">
                      <img src={VerditerFlycatcher} class="bird-pic"/>
                      <div>
                        <h4>Macaw</h4>
                        <small>Thrumshingla, Mongar</small>
                      </div>
                    </div>
                    <div class="sighting-date">
                      <span>12 Mar 2023</span>
                    </div>
                  </div>
                  <div class="eBirder">
                    <div class="info">
                      <img src={VerditerFlycatcher} class="bird-pic"/>
                      <div>
                        <h4>Macaw</h4>
                        <small>Thrumshingla, Mongar</small>
                      </div>
                    </div>
                    <div class="sighting-date">
                      <span>12 Mar 2023</span>
                    </div>
                  </div>
                  <div class="eBirder">
                    <div class="info">
                      <img src={VerditerFlycatcher} class="bird-pic"/>
                      <div>
                        <h4>Macaw</h4>
                        <small>Thrumshingla, Mongar</small>
                      </div>
                    </div>
                    <div class="sighting-date">
                      <span>12 Mar 2023</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="explore-birds">
            <div class="section-header">
              <h3>Explore Birds</h3>
              <div class="buttons-container">
                <button>All</button>
                <button>Popular</button>
                <span class="material-icons">arrow_forward</span>
              </div>
            </div>
            <div class="popularImg-section">
              <div class="popular-img">
                <img src={VerditerFlycatcher} class="b-img"/>
                <h3>Dove</h3>
                <span class="material-icons">location_on <small>Dochula</small></span>
                <button>Landbird</button>
              </div>
              <div class="popular-img">
                <img src={VerditerFlycatcher} class="b-img"/>
                <h3>Dove</h3>
                <span class="material-icons">location_on <small>Dochula</small></span>
                <button>Landbird</button>
              </div>
              <div class="popular-img">
                <img src={VerditerFlycatcher} class="b-img"/>
                <h3>Dove</h3>
                <span class="material-icons">location_on <small>Dochula</small></span>
                <button>Landbird</button>
              </div>
              <span class="material-icons arrow">arrow_forward</span>
            </div>  
          </div>
        </div>
    {/* <UserList /> */}
    </div>
  );
}

export default Dashboard;
//  edit
