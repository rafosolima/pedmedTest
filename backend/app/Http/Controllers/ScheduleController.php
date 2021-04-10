<?php

namespace App\Http\Controllers;

use App\Repositories\Contracts\IPatientRepository;
use App\Repositories\Contracts\IScheduleRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ScheduleController extends Controller
{

    private $repositorySchedule;
    private $repositoryPatientRepository;
    private $request;

    public function __construct(
        IScheduleRepository $repositorySchedule,
        IPatientRepository $repositoryPatientRepository,
        Request $request
    ) {
        $this->repositorySchedule = $repositorySchedule;
        $this->repositoryPatientRepository = $repositoryPatientRepository;
        $this->request = $request;
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return response()->json(
            $this->repositorySchedule->findAll()
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
                    "patient_id" => "required|numeric",
                    "marked" => "required|date"
                ]
            );

            if ($validator->fails()) {
                return response()->json([
                    'message' => $validator->errors()
                ], 400);
            }

            $data = $this->request->all();

            if (
                $this->repositoryPatientRepository->find($data['patient_id']) &&
                $this->repositorySchedule->create($data)
            ) {
                return response()->json([
                    'message' => 'Agendamento salvo com sucesso'
                ]);
            }

            return response()->json([
                'message' => 'Agendamento não foi salvo com sucesso'
            ], 400);
        } catch (\Throwable $th) {
            dd($th);
            return response()->json([
                'message' => 'Agendamento não foi salvo com sucesso'
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
            $data = $this->repositorySchedule->find(
                $this->request->id
            );

            return response()->json($data);
        } catch (\Throwable $th) {
            return response()->json([
                'message' => 'Agendamento não encontrado'
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
                    "patient_id" => "required|numeric"
                ]
            );

            if ($validator->fails()) {
                return response()->json([
                    'message' => $validator->errors()
                ], 400);
            }

            $data = $this->request->all();

            if (
                $this->repositoryPatientRepository->find($data['patient_id']) &&
                $this->repositorySchedule->update($data, $this->request->id)
            ) {
                return response()->json([
                    'message' => 'Agendamento editado com sucesso'
                ]);
            }
            return response()->json([
                'message' => 'Agendamento não encontrado'
            ], 404);
        } catch (\Throwable $th) {
            return response()->json([
                'message' => 'Agendamento não encontrado'
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
                    "id" => "required|numeric",
                ]
            );

            if ($validator->fails()) {
                return response()->json([
                    'message' => $validator->errors()
                ], 400);
            }

            if ($this->repositorySchedule->delete($this->request->id)) {
                return response()->json([
                    'message' => 'Agendamento deletado com sucesso'
                ]);
            }

            return response()->json([
                'message' => 'Agendamento não foi deletado'
            ], 400);
        } catch (\Throwable $th) {
            return response()->json([
                'message' => 'Agendamento não foi deletado'
            ], 400);
        }
    }
}
