import { LightningElement, api, wire, track } from 'lwc';

export default class ProgressRing extends LightningElement {

    @track circlestyle;

    @api ringColor;
    @api percentage = 60;
    @api title ;
    @api percentageVal;
    @api titlePlacement;
    @api remainingRingColour;
    @api percentageType;
    @api source;
    @api target;
    @api textInsideRing;
    @api showBothTextAndPercentage;

    connectedCallback(){
        if(this.percentageType == 'Static'){
            if(Number(this.percentage) > 100){
                this.percentageVal = this.percentage;
                this.percentage = (this.percentage/1000)*100;
            }
            else if(Number(this.percentage) < 1){
                this.percentageVal = this.percentage*1000;
                this.percentage = this.percentage*100;
            }
            else{
                this.percentageVal = this.percentage;
            }
            console.log('Percentage val '+this.percentageVal+' percentage '+this.percentage);
            
        }
        else if(this.percentageType == 'Relational'){
            var x = Math.round(((this.source/this.target) *100) * 100) / 100
            if(x>100){
                this.percentageVal = this.source+'/'+this.target;
                this.percentage = 100;
            }
            else {
                this.percentageVal = this.source+'/'+this.target;
                this.percentage = x;

            }
            
        }

        if(this.showBothTextAndPercentage){
            if(this.textInsideRing !=null && this.textInsideRing!= '')
                this.percentageVal = this.textInsideRing+' ('+this.percentageVal+')';
        }
        else if(this.textInsideRing !=null && this.textInsideRing!= ''){
            this.percentageVal = this.textInsideRing;
        }
    }

    renderedCallback(){
        let colorStyle = '';
        let circleStyle ='';
        if(this.remainingRingColour == null)
            this.remainingRingColour = '#8080807a';
        this.template.querySelector('svg circle').style.stroke = this.ringColor;
        colorStyle ='stroke: '+this.ringColor;
        this.template.querySelector('.bar').style.backgroundColor = this.remainingRingColour;
        var circle = this.template.querySelector('circle');
        var radius = circle.r.baseVal.value;
        var circumference = radius * 2 * Math.PI;
        const offset = circumference - this.percentage / 100 * circumference;
        circle.style.strokeDashoffset = offset;
        circleStyle = 'stroke-dashoffset: '+offset;

        this.circlestyle = colorStyle+';'+circleStyle;
        console.log(this.circlestyle+' Radius '+radius+' circumference '+circumference +' offset '+offset);
        if(this.titlePlacement == 'Header'){
            this.template.querySelector(".heading2").style.display = "none";
            this.template.querySelector(".heading").style.display = "block";
        }
        else if(this.titlePlacement == 'Footer'){
            this.template.querySelector(".heading").style.display = "none";
            this.template.querySelector(".heading2").style.display = "block";
        }
        //this.template.querySelector(".percentageVal").style.display = "block";
    }
}