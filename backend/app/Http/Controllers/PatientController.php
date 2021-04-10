<?php

namespace App\Http\Controllers;

use App\Repositories\Contracts\IPatientRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PatientController extends Controller
{
    private $repository;

    public function __construct(
        IPatientRepository $repository,
        Request $resquest
    )
    {
        $this->middleware('auth:api');
        $this->repository = $repository;
        $this->request = $resquest;
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return response()->json(
            $this->repository->findAll()
        );
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store()
    {
        try {
            $validator = Validator::make(
                $this->request->all(),
                [
                    "name" => "required",
                    "phone" => "required",
                    "email" => "required|unique:patients",
                    "birthdate" => "required",
                    "gender" => "required",
                ]
            );
    
            if ($validator->fails()) {
                return response()->json([
                    'message' => $validator->errors()
                ], 400);
            }

            $data = $this->request->all();
            if($this->repository->create($data)) {
                return response()->json([
                    'message' => 'Paciente salvo com sucesso'
                ]);
            }

            return response()->json([
                'message' => 'Paciente não foi salvo com sucesso'
            ], 400);
        } catch (\Throwable $th) {
            return response()->json([
                'message' => 'Paciente não foi salvo com sucesso'
            ], 400);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Patient  $Patient
     * @return \Illuminate\Http\Response
     */
    public function show()
    {
        try {
            $data = $this->repository->find(
                $this->request->id
            );

            return response()->json($data);
        } catch (\Throwable $th) {
            return response()->json([
                'message' => 'Paciente não encontrado'
            ], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Patient  $Patient
     * @return \Illuminate\Http\Response
     */
    public function update()
    {
        try {
            $validator = Validator::make(
                array_merge(
                    $this->request->all(),
                    [
                        'id' => $this->request->id
                    ]
                ),
                [
                    'id' => "required|numeric",
                    "email" => "unique:patients,email,{$this->request->id}",
                ]
            );
    
            if ($validator->fails()) {
                return response()->json([
                    'message' => $validator->errors()
                ], 400);
            }

            $data = $this->request->all();

            if($this->repository->update($data, $this->request->id)) {
                return response()->json([
                    'message' => 'Paciente editado com sucesso'
                ]);
            }
            return response()->json([
                'message' => 'Paciente não encontrado'
            ], 404);
        } catch (\Throwable $th) {
            return response()->json([
                'message' => 'Paciente não encontrado'
            ], 404);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Patient  $Patient
     * @return \Illuminate\Http\Response
     */
    public function destroy()
    {
        try {
            $validator = Validator::make(
                [
                    'id' => $this->request->id
                ],
                [
                    'id' => "required|numeric"
                ]
            );
    
            if ($validator->fails()) {
                return response()->json([
                    'message' => $validator->errors()
                ], 400);
            }

            if($this->repository->delete($this->request->id)) {
                return response()->json([
                    'message' => 'Paciente deletado com sucesso'
                ]);
            }

            return response()->json([
                'message' => 'Paciente não foi deletado'
            ], 400);
        } catch (\Throwable $th) {
            return response()->json([
                'message' => 'Paciente não foi deletado'
            ], 400);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Patient  $Patient
     * @return \Illuminate\Http\Response
     */
    public function getSchedules()
    {
        try {
            $validator = Validator::make(
                [
                    'id' => $this->request->id
                ],
                [
                    'id' => "required|numeric"
                ]
            );
    
            if ($validator->fails()) {
                return response()->json([
                    'message' => $validator->errors()
                ], 400);
            }

            if($patient = $this->repository->find($this->request->id)) {
                return response()->json(
                    $patient->schedules
                );
            }

            return response()->json([
                'message' => 'Paciente sem agendamento'
            ], 400);
        } catch (\Throwable $th) {
            return response()->json([
                'message' => 'Paciente sem agendamento'
            ], 400);
        }
    }
}
