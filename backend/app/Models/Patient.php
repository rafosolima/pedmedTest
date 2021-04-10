<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Patient extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name', 'phone', 'email', 'birthdate', 'gender', 'height', 'width'
    ];

    protected $dates = [
        'birthdate'
    ];

    public function schedules()
    {
        return $this->hasMany(Schedule::class);
    }

    public function setBirthdateAttribute($date) 
    {
        $date = str_replace('/', '-', $date);
        $this->attributes['birthdate'] = Carbon::parse($date)->format('Y-m-d');
    }
}
