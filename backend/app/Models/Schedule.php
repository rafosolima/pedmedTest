<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Schedule extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'patient_id', 'anotations', 'marked'
    ];

    protected $dates = [
        'marked'
    ];

    public function patient()
    {
        return $this->hasOne(Patient::class)->orderBy('marked', 'DESC')->get();
    }

    public function setmarkedAttribute($date) 
    {
        $date = str_replace('/', '-', $date);
        $this->attributes['marked'] = Carbon::parse($date)->format('Y-m-d H:i:s');
    }
}
