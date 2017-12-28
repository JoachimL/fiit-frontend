<template>

<div>

<div v-if="loadingWorkout" class="text-center">
    <img src="/static/images/spinner.gif" height="256" width="256"/>
    <p class="text-muted">Loading workout...</p>
</div>

<div v-else>
    <div class="btn-group pull-right" dropdown>
        <button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <span class="glyphicon glyphicon-cog" aria-hidden="true"></span>
            <span class="caret"></span>
            <span class="sr-only">Show menu</span>
        </button>
        <ul class="dropdown-menu" role="menu">
            <li>
                <a data-toggle="collapse" href="#workoutDetailsEditor" aria-expanded="false" aria-controls="workoutDetailsEditor">
                    <span class="glyphicon glyphicon-edit"></span> Edit workout
                </a>
            </li>

            <li v-if="activities">
                <a href="#" class="submit-form" data-target="#copy-workout-form">
                    <span class="glyphicon glyphicon-copy"></span> Copy this workout
                </a>
                <form method="post" id="copy-workout-form" class="copy-workout form-inline" asp-action="CopyWorkout">
                    <input name="WorkoutId" type="hidden" value="@Model.WorkoutId" />
                    <input name="CurrentDateTime" class="current-datetime" type="hidden" />
                    <input name="TimeZoneName" value="Europe/Oslo" type="hidden" />
                    <button type="submit" class="btn btn-primary copy-workout hidden-submit">Copy this workout</button>
                </form>
            </li>
        
            <li class="divider"></li>
            <li>
                <a asp-action="Delete" asp-route-id="@Model.WorkoutId">
                    <span class="glyphicon glyphicon-trash"></span> Delete
                </a>
            </li>
        </ul>
    </div>

    <h2>Workout details</h2>
    <small class="startDateTimeheader"></small>

    <form v-on:submit.prevent="onSubmit" class="form-inline collapse well" id="workoutDetailsEditor">
        <div class="form-group">
            <input type="hidden" id="StartDateTime-ISO" value="@Model.StartDateTime.ToString("o")" />
            <label asp-for="StartDateTime" class="control-label"></label>
            <div class='input-group date' id='startedDateTimeInput'>
                <span class="input-group-addon">
                    <span class="glyphicon glyphicon-calendar"></span>
                </span>
                <input asp-for="StartDateTime" class="form-control" />
                <span class="input-group-btn">
                    <button type="submit" class="btn btn-primary" v-on:click="saveWorkout()">Update</button>
                </span>
            </div>

            <span asp-validation-for="StartDateTime" class="text-danger"></span>
        </div>
    </form>
    <hr />


    <h3 v-if="newActivity">Add activity</h3>
    <h3 v-else>Update activity</h3>
    <div class="row">
        <div class="col-xs-12">
            <div v-if="loadingActivity" class="text-center">
                <img src="/static/images/spinner.gif" height="256" width="256"/>
                <p class="text-muted">Loading workout...</p>
            </div>
            <form v-else asp-action="SaveActivity" class="form">
                <div class="form-group">
                    <label for="exercise">Exercise</label>
                    <v-select v-model="selectedExercise"
                        :disabled="!exercises"
                        label="name"
                        :options="exercises"
                        placeholder="Select exercise"
                        :onChange="getRecommendedSets"
                        >
                        
                    </v-select>
                </div>
                <div class="sets">
                    <div class="row">
                        <div class="col-xs-2">
                            <p class="form-control-static"><strong>Set</strong></p>
                        </div>
                        <div class="col-xs-5">
                            <p class="form-control-static"><strong>Repetitions</strong></p>
                        </div>
                        <div class="col-xs-5">
                            <p class="form-control-static"><strong>Weight</strong></p>
                        </div>
                    </div>
                    <div class="row" v-for="set in sets" :key="set.index">
                        <div class="col-xs-2"><p class="form-control-static"><strong>{{set.index + 1}}</strong></p></div>
                        <div class="col-xs-5">
                            <label for="set-reps-@set.Index" class="sr-only">Repetitions</label>
                            <input class="form-control" v-model="set.repetitions" v-bind:id="'set-reps-' + set.index" size="3" placeholder="Reps" type="number" step="1" />
                        </div>
                        <div class="col-xs-5">
                            <label for="set-weight-@set.Index" class="sr-only">Weight</label>
                            <input class="form-control" v-model="set.weight" v-bind:id="'set-weight-' + set.index" type="number" step="0.1" min="0" size="5" placeholder="Weight" />
                        </div>
                    </div>
                    
                </div>
                <div class="row">
                    <div class="col-xs-offset-8 col-xs-4">
                        <button class="btn btn-primary add-set pull-right" type="button" v-on:click="addSet">
                            <span class="glyphicon glyphicon-plus" aria-hidden="true"></span> <span class="sr-only">Add set</span></a>
                        </button>
                    </div>
                </div>
                <div class="row">
                    <div class="col-sm-12">
                        <button type="submit" class="btn btn-success" :disabled="!selectedExercise">
                            <span class="glyphicon glyphicon-check" aria-hidden="true"></span> Finish activity
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </div>


    <div class="row" v-if="pendingActivities">
        <div class="col-sm-12">
            <h3>Pending activities</h3>
            <p>Click activity to add it to your workout.</p>
            <div class="list-group">
                <button v-for="activity in pendingActivities" v-bind:key="activity.id" v-on:click="loadPendingActivity(activity)" class="list-group-item d-flex justify-content-between align-items-center">
                    {{ activity.exerciseName}}
                    <span class="glyphicon glyphicon-chevron-right pull-right"></span>
                </button>
                
            </div>
        </div>
    </div>


    <div class="row">
        <div class="col-sm-12">
            <h3>Completed activities</h3>
            <div class="list-group">
                <a v-for="activity in activities" :key="activity.id" asp-action="Detail" asp-route-id="@Model.WorkoutId" asp-route-activityId="@activity.Id" class="list-group-item d-flex justify-content-between align-items-center">
                    @activity.ExerciseName
                </a>
            </div>
        </div>
    </div>
    0
    <div>
        <a asp-action="Index">Back to List</a>
    </div>

    </div>
</div>
</template>

<script>
import vSelect from "vue-select"
import axios from 'axios'



export default {
  components: {
      vSelect
 },
  data () {
    return {
      loadingWorkout: false,
      loadingActivity: false,
      error: null,
      exercises: [],
      sets: this.createDefaultSets(),
      activities: [],
      pendingActivities: [],
      newActivity: true,
      selectedExercise: null
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.fetchExercises()
      this.fetchWorkout()
    },
    fetchWorkout ()  {
        this.loadingWorkout = true;
        this.loadingText = "Loading workout...";
        axios.get(process.env.API_ROOT + '/workouts/' + this.$route.params.workoutId)
            .then(response=>{
                var workout = response.data;
                this.pendingActivities = workout.pendingActivities;
                this.activities = workout.activities;
                this.loadingWorkout = false;
            })
            .catch(e=>{
                console.log(e);
                this.loadingWorkout = false;    
            })
            
    },
    fetchExercises () {
      this.loadingExercises = true;
      axios
        .get(process.env.API_ROOT + '/exercises')
        .then(exercises => {
          this.exercises = exercises.data.map( (e,index) => ({index, ...e}));
          this.loadingExercises = false;
        })
        .catch(e => {
          console.log('Error occured: ' + e)
          this.loadingExercises = false;
        })
    }, 
    addSet (weight, repetitions) {
        if(repetitions && weight){
            this.sets.push({repetitions:repetitions, weight: weight, index: this.sets.length});
        }
        else{
            var last = this.sets[this.sets.length - 1];
            this.sets.push({repetitions:last.repetitions, weight: last.weight, index: this.sets.length});
        }
    },
    getRecommendedSets (exercise) {
        if(exercise) {
          this.loadingActivity = true;
          axios.get(process.env.API_ROOT + '/my/exercises/' + exercise.Id + '/last')
                .then(function (response) {
                    var data = response.data;
                    var sets = data && data.sets;
                    if (sets && sets.length) {
                        this.sets = sets.map( (set, idx) => ({index: idx, ...set}));
                    } else {
                        this.sets = createDefaultSets();
                    }
                    //this.selectedExercise = exerciseId
                    this.loadingActivity = false;
                })
                .catch(e=>{
                    //this.selectedExercise = value.id
                    this.loadingActivity = false;
                })
        }
    },
    loadPendingActivity(activity){
        console.log('Loading pending activity...')
        this.isNewActivity = true;
        this.selectedExercise = this.exercises.find(e=>e.id == activity.exerciseId);
    },
    loadCompletedActivity(activity){
        console.log('Loading completed activity...')
        this.activeActivity = activity;
    },
    createDefaultSets() { 
        return [
        { index: 0, weight: 0, repetitions: 0 },
        { index: 1, weight: 0, repetitions: 0 },
        { index: 2, weight: 0, repetitions: 0 }
        ];
    }
  }
}

/*
    $(function () {

        $('a.submit-form').click(function () {
        $($(this).attr('data-target')).submit();
        });
        $('.hidden-submit').hide();

        $('form.copy-workout').submit(function () {
            $('form.copy-workout .current-datetime').val(moment().format())
        })

        var startDateTime = moment($("#StartDateTime-ISO").val());
        $('.startDateTimeheader').text(startDateTime);
        $('.add-set').click(function () { addSet(0, 0) });

        $('#startedDateTimeInput').datetimepicker({
            format: 'YYYY/MM/DD HH:mm'
        });
        $('#startedDateTimeInput')
            .data("DateTimePicker")
            .date(startDateTime);

        $("#exerciseSelect").selectize();

        $('#exerciseSelect').change(function (event) {
            var exerciseId = $("#exerciseSelect option:selected").val();

            fetch('/api/users/@Model.UserId/exercises/' + exerciseId + '/last')
                .then((data) => data.json())
                .then(function (data) {
                    var sets = data && data.sets;
                    if (sets && sets.length) {
                        $('.set-table-body').empty();
                        var ii = 0;
                        for (ii = 0; ii < sets.length; ii++) {
                            addSet(sets[ii].weight, sets[ii].repetitions)
                        }
                    }
                })
            })
        })
    */
</script>
<style lang="css">

</style>