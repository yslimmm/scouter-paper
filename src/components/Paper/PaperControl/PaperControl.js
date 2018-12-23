import React, {Component} from 'react';
import './PaperControl.css';
import * as Options from './Options';
import {Draggable} from 'react-drag-and-drop'
import ReactTooltip from 'react-tooltip'
import AlertList from "./AlertList";
import {connect} from 'react-redux';

class PaperControl extends Component {

    options = null;
    touch = false;

    constructor(props) {
        super(props);
        this.options = Options.options();


        if ("ontouchstart" in document.documentElement) {
            this.touch = true;
        }

        this.state = {
            currentGroup: null
        }
    }

    openGroup = (groupName) => {
        if (groupName === this.state.currentGroup) {
            this.setState({
                currentGroup : null
            });
        } else {
            this.setState({
                currentGroup : groupName
            });
        }
    };

    render() {

        return (
            <div className={"papers-controls noselect " + (this.touch ? 'touch' : '')}>

                <div className="control-item first">
                    <div className="row desc">
                        <div className="step"><span>1</span></div>
                        <div className="row-message">ADD EMPTY PAPER</div>
                    </div>
                    <div className="row control">
                        <div>
                            <div className="paper-control paper-control-btn" onClick={this.props.addPaper}>
                                <i className="fa fa-plus-circle" aria-hidden="true"></i><span className="paper-control-text">ADD PAPER</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="control-item">
                    <div className="row desc">
                        <div className="step"><span>2</span></div>
                        <div className="row-message">DRAG METRIC TO THE PAPER</div>
                    </div>
                    <div className="row control metric-row">
                        <div>
                            <div className="paper-control-metrics">
                                <div key={"GENERAL"} className={"paper-control multi-control " + (this.state.currentGroup === "GENERAL" ? "opened" : "")} >
                                <div className="group-name">
                                    <span>GENERAL</span>
                                    <span class="toggle-filter-icon" onClick={this.openGroup.bind(this, "GENERAL")}><i class="fa fa-angle-down" aria-hidden="true"></i></span>
                                </div>
                                <ul>
                                    {Object.keys(this.options).map((name, i) => {
                                        return <li>
                                            <div key={i} className="paper-control" data-tip={this.options[name].title} >
                                                {(!this.touch) &&
                                                <Draggable type="metric" className="draggable paper-control-item" data={JSON.stringify(this.options[name])} >
                                                    <div className="draggable-icon">draggable</div>
                                                    {this.options[name].icon && <i className={"fa " + this.options[name].icon} aria-hidden="true"></i>}
                                                    {this.options[name].title && <span className="text-icon">{this.options[name].title}</span>}
                                                </Draggable>
                                                }
                                                {(this.touch) &&
                                                <div onClick={this.props.addPaperAndAddMetric.bind(this, JSON.stringify(this.options[name]))}>
                                                    {this.options[name].icon && <i className={"fa " + this.options[name].icon} aria-hidden="true"></i>}
                                                    {this.options[name].title && <span className="text-icon">{this.options[name].title}</span>}
                                                </div>
                                                }
                                            </div>
                                        </li>
                                    })}
                                </ul>
                            </div>


                            {this.props.counterInfo.families.map((family, i) => {
                                return <div key={i} className={"paper-control multi-control " + (this.state.currentGroup === family.name ? "opened" : "")} >
                                    {(!this.touch) && <div className="multi-metrics">
                                        <div className="group-name">
                                            <span>{family.name}</span>
                                            <span class="toggle-filter-icon" onClick={this.openGroup.bind(this, family.name)}><i class="fa fa-angle-down" aria-hidden="true"></i></span>
                                        </div>
                                        <ul>
                                            {family.counters.sort((a,b) => {
                                                return a.displayName.localeCompare(b.displayName);
                                            }).map((counter, j) => {
                                                counter.familyName = family.name;
                                                return <li key={j}>
                                                    <Draggable type="metric" className="draggable paper-control-item" data={JSON.stringify(counter)}>
                                                        <div className="draggable-icon">draggable</div>
                                                        <span className="text-icon">{counter.displayName}</span>
                                                    </Draggable>
                                                </li>
                                            })}
                                        </ul>
                                    </div>}
                                    {(this.touch) && <div className="multi-metrics">
                                        <div className="group-name">{family.name}</div>
                                        <ul>
                                            {family.counters.sort((a,b) => {
                                                return a.displayName.localeCompare(b.displayName);
                                            }).map((counter, j) => {
                                                counter.familyName = family.name;
                                                return <li key={j}>
                                                    <div className="paper-control-item" onClick={this.props.addPaperAndAddMetric.bind(this, JSON.stringify(counter))}>
                                                        <span className="text-icon">{counter.displayName}</span>
                                                    </div>
                                                </li>
                                            })}
                                        </ul>
                                    </div>}
                                </div>
                            })}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="control-item">
                    <div className="row desc">
                        <div className="step"><span>3</span></div>
                        <div className="row-message">CLEAR ALL PAPER</div>
                    </div>
                    <div className="row control">
                        <div>
                            <div className="paper-control paper-control-btn" onClick={this.props.clearLayout}>
                                <i className="fa fa-trash-o" aria-hidden="true"></i><span className="paper-control-text">CLEAR ALL PAPER</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/*
                <div className="paper-control-separator paper-right"></div>
                <div className="paper-control paper-alert paper-right" data-count={this.props.alert.data.length > 99 ? "99+" : this.props.alert.data.length} onClick={this.props.toggleShowAlert} data-tip="CLICK TO SHOW ALERT">
                    <span><i className="fa fa-exclamation-circle" aria-hidden="true"></i></span>
                </div>
                <ReactTooltip />
                <AlertList alert={this.props.alert} show={this.props.showAlert} setRewind={this.props.setRewind} clearAllAlert={this.props.clearAllAlert} clearOneAlert={this.props.clearOneAlert} />*/}
            </div>
        );
    }
}

let mapStateToProps = (state) => {
    return {
        counterInfo: state.counterInfo
    };
};

PaperControl = connect(mapStateToProps, undefined)(PaperControl);

export default PaperControl;

