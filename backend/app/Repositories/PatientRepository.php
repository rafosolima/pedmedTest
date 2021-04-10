<?php

namespace App\Repositories;

use App\Models\Patient;
use App\Repositories\Contracts\IPatientRepository;

class PatientRepository extends AbstractRepository implements IPatientRepository
{
	public function __construct(Patient $model)
	{
		$this->model = $model;
	}
}