<?php

namespace App\Repositories;

use App\Models\Schedule;
use App\Repositories\Contracts\IScheduleRepository;

class ScheduleRepository extends AbstractRepository implements IScheduleRepository
{
	public function __construct(Schedule $model)
	{
		$this->model = $model;
	}
}