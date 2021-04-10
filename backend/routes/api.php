<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::get('/', function(Request $request) {
    return response()->json([
        'name' => 'API pedmed',
        'version' => 'V1'
    ]);
});

Route::group([
    'prefix' => 'v1'
], function ($router) {
    Route::group([
        'prefix' => 'auth'
    ], function($router) {
        Route::post('register', 'AuthController@register');
        Route::post('login', 'AuthController@login');
        Route::post('logout', 'AuthController@logout');
        Route::post('refresh', 'AuthController@refresh');
        Route::post('me', 'AuthController@me');
    });

    Route::group([
        'prefix' => 'patients'
    ], function($router) {
        Route::get('/', 'PatientController@index');
        Route::get('/{id}/schedules', 'PatientController@getSchedules');
        Route::get('/{id}', 'PatientController@show');
        Route::post('/', 'PatientController@store');
        Route::put('/{id}', 'PatientController@update');
        Route::delete('/{id}', 'PatientController@destroy');
    });

    Route::group([
        'prefix' => 'schedules'
    ], function($router) {
        Route::get('/', 'ScheduleController@index');
        Route::get('/{id}', 'ScheduleController@show');
        Route::post('/', 'ScheduleController@store');
        Route::put('/{id}', 'ScheduleController@update');
        Route::delete('/{id}', 'ScheduleController@destroy');
    });
});
